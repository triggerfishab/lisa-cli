import chalk from "chalk"
import fetch from "node-fetch"

import { askForProjectName, getEmailAddress } from "../../lib/app-name.js"
import exec from "../../lib/exec.js"
import { writeError, writeSuccess } from "../../lib/write.js"

async function createKinstaSite() {
  try {
    const [apiKey, companyId] = await exec(
      "op item get uhfxs25bmpaqk24fay4wz7qsie --fields label='kinsta.api key',label='kinsta.company id'",
    ).then((res) => res.stdout.trim().split(","))

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

export default createKinstaSite
