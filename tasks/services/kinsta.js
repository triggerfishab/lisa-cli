import fetch from "node-fetch"
import { getEmailAddress, askForProjectName } from "../../lib/app-name.js"
import { writeError, writeSuccess } from "../../lib/write.js"
import exec from "../../lib/exec.js"
import chalk from "chalk"

async function createKinstaSite() {
  let apiKey = await exec(
    `op read op://shared/kinstahosting/lisa-cli_api-key`
  ).then((res) => res.stdout.trim())

  let companyId = await exec(
    `op read op://shared/kinstahosting/company-id`
  ).then((res) => res.stdout.trim())

  let projectName = await askForProjectName(
    "Enter the name of your site. Please choose wisely, as this cannot be changed later."
  )
  let emailAddress = await getEmailAddress()

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
        `Error creating site on Kinsta. Error code: ${response.status}, message: ${response.message}`
      )
    } else {
      writeSuccess(
        `Kinsta site creation process initiated. An email will be sent to ${chalk.underline(
          emailAddress
        )} once completed.`
      )
    }
  })
}

export default createKinstaSite
