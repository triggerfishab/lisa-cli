const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const { writeStep, writeInfo } = require("../lib/write")

program
  .command("sendgrid setup")
  .description("Setup Sendgrid account")
  .action(setupSendgridAccount)

async function setupSendgridAccount() {
  let projectName = await getProjectName()

  writeStep("Setup Sendgrid account ⚡️⚡️⚡️")

  writeInfo(projectName)
}

module.exports = setupSendgridAccount
