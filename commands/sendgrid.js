const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const { writeStep, writeInfo } = require("../lib/write")
const conf = require("../lib/conf")

program
  .command("sendgrid")
  .description("Setup Sendgrid account")
  .action(setupSendgridAccount)

async function setupSendgridAccount() {
  let projectName = await getProjectName()
  let sendgrid = conf.get("sendgrid") || (await setup("sendgrid")).sendgrid
  let { apiKey } = sendgrid

  writeStep("Setup Sendgrid account")

  writeInfo(projectName)
  writeInfo(apiKey)
}

module.exports = setupSendgridAccount
