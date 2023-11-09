import chalk from "chalk"
import fetch from "node-fetch"

import { askForProjectName, getEmailAddress } from "../../lib/app-name.js"
import exec from "../../lib/exec.js"
import { writeError, writeSuccess } from "../../lib/write.js"

export async function getKinstaCredentials() {
  const [apiKey, companyId] = await exec(
    "op item get l2i57yslyjfr5jsieew4imwxgq --fields label='kinsta.api key',label='kinsta.company id'",
  ).then((res) => res.stdout.trim().split(","))
  return {
    apiKey,
    companyId,
  }
}
export default async function createKinstaSite() {
  try {
    const { apiKey, companyId } = await getKinstaCredentials()

    const projectName = await askForProjectName(
      "Enter the name of your site. Please choose wisely, as this cannot be changed later.",
    )
    const emailAddress = await getEmailAddress()

    await fetch("https://api.kinsta.com/v2/sites", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_email: emailAddress,
        admin_password: Date.now().toString(),
        admin_user: "admin",
        company: companyId,
        display_name: projectName,
        install_mode: "new",
        is_multisite: false,
        is_subdomain_multisite: false,
        region: "europe-north1",
        site_title: projectName,
        woocommerce: false,
        wordpressseo: false,
        wp_language: "en_US",
      }),
    }).then((response) => {
      if (response.status !== 202) {
        writeError(
          `Error creating site on Kinsta. Error code: ${response.status}, message: ${response.message}`,
        )
      } else {
        writeSuccess(
          `Kinsta site creation process initiated. An email will be sent to ${chalk.underline(
            emailAddress,
          )} once completed.`,
        )
      }
    })
  } catch (error) {
    writeError(`Failed creating Kinsta site. \n ${error}`)
    process.exit(1)
  }
}

export async function cloneKinstaSite() {
  try {
    const { apiKey, companyId } = await getKinstaCredentials()

    const projectName = await askForProjectName(
      "Enter the name of your site. Please choose wisely, as this cannot be changed later.",
    )
    const emailAddress = await getEmailAddress(`${projectName}@triggerfish.se`)

    await fetch("https://api.kinsta.com/v2/sites/clone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        company: companyId,
        display_name: projectName,
        source_env_id: "15dfc2b9-a627-4e0d-bcd9-434a78b399b1",
      }),
    }).then((response) => {
      if (response.status !== 202) {
        writeError(
          `Error cloning site on Kinsta. Error code: ${response.status}, message: ${response.message}`,
        )
      } else {
        writeSuccess(
          `Kinsta site cloning process initiated. An email will be sent to ${chalk.underline(
            emailAddress,
          )} once completed.`,
        )
        console.log(response.json())
      }
    })
  } catch (error) {
    writeError(`Failed cloning Kinsta site. \n ${error}`)
    process.exit(1)
  }
}

export async function getKinstaSites() {
  try {
    const { apiKey, companyId } = await getKinstaCredentials()

    const res = await fetch(
      `https://api.kinsta.com/v2/sites?company=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    const json = await res.json()
    if (json.company.sites.length === 0) {
      writeError(
        `No sites found for company ${companyId}. Please create a site first.`,
      )
      process.exit(1)
    }
    return json.company.sites
  } catch (error) {
    writeError(`Failed Fetching Kinsta sites. \n ${error}`)
    process.exit(1)
  }
}
export async function listKinstaSites() {
  const sites = await getKinstaSites()
  sites.map((site) => {
    const labels = site.site_labels.map((label) => {
      return label.name
    })
    site.site_labels = labels.join(", ")
    return site
  })
  console.table(sites)
}
export async function getKinstaSiteByProjectName(projectName) {
  const sites = await getKinstaSites()
  const site = sites.find(
    (site) =>
      site.display_name.includes(projectName) ||
      site.name.includes(projectName),
  )
  if (!site) {
    writeError(`No site found with name ${projectName}`)
    process.exit(1)
  }
  console.log(site)
}

export async function getKinstaOperationStatusById(operationId) {
  try {
    const { apiKey } = await getKinstaCredentials()

    const res = await fetch(
      `https://api.kinsta.com/v2/operations/${operationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    const json = await res.json()

    // 200 The operation has successfully finished
    if (json.status === 200) {
      return true
    }
    // 202 The operation is still in progress
    if (json.status === 202) {
      return false
    }
    // 404 The operation was not found
    if (json.status === 404) {
      writeError(`Operation not found. \n ${json.message}`)
      process.exit(1)
    }
    // 500 The operation has failed
    if (json.status === 500) {
      writeError(`Operation failed. \n ${json.message}`)
      process.exit(1)
    }
  } catch (error) {
    writeError(`Failed Fetching Kinsta sites. \n ${error}`)
    process.exit(1)
  }
}
export async function checkKinstaOperationStatusById(operationId) {
  const operationStatus = await getKinstaOperationStatusById(operationId)
  if (operationStatus) {
    writeSuccess(`Operation ${operationId} finished successfully.`)
    process.exit(0)
  }
  writeError(`Operation ${operationId} is still in progress.`)
  process.exit(1)
}
