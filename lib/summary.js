const chalk = require("chalk")
const { getAppName } = require("./app-name")
const conf = require("./conf")
const { writeInfo, writeStep } = require("./write")

async function writeSummary() {
  let apiUrl = conf.get("apiUrl")
  let appName = await getAppName()

  writeStep(chalk.underline("Summary:"))
  writeInfo(`API url: ${apiUrl}/wp/wp-admin`)
  writeInfo(
    `To start frontend app, run: ${chalk.bold(
      chalk.underline(`cd ${appName} && yarn dev`)
    )}`
  )
  writeInfo(
    `Before doing anything else, go to: ${apiUrl}/wp/wp-admin/tools.php?page=redirection.php and complete the installer.`
  )
}

module.exports = { writeSummary }
