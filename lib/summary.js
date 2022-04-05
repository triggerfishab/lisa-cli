const chalk = require("chalk")
const { getAppName } = require("./app-name")
const conf = require("./conf")
const store = require("./store")
const { getVaultPass } = require("./vault")
const { writeInfo, writeStep } = require("./write")

async function writeSummary() {
  let apiUrl = conf.get("apiUrl")
  let appName = await getAppName()
  let vaultPass = getVaultPass()
  let { username, password } = store.get("admin")

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

  writeStep(chalk.underline("Save this information to 1Password:"))
  writeInfo(`Vault pass: ${vaultPass}`)
  writeInfo(`WordPress username: ${username}`)
  writeInfo(`WordPress password: ${password}`)
}

module.exports = { writeSummary }
