const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const { writeStep, writeInfo, writeSuccess } = require("../lib/write")
const client = require("@sendgrid/client")
const conf = require("../lib/conf")
const setup = require("../commands/setup")
const passwordGenerator = require("generate-password")

program
  .command("sendgrid")
  .description("Setup Sendgrid account")
  .action(setupSendgridAccount)

async function setupSendgridAccount() {
  writeStep("Setting up Sendgrid subuser")

  let projectName = await getProjectName()

  let { apiKey } = conf.get("sendgrid") || (await setup("sendgrid")).sendgrid

  client.setApiKey(apiKey)

  try {
    let [, ips] = await client.request({
      method: "GET",
      url: "/v3/ips/assigned",
    })

    const ip = ips[0].ip

    let [, body] = await client.request({
      method: "POST",
      url: "/v3/subusers",
      body: {
        username: projectName,
        email: `${projectName}@sendgrid.triggerfish.se`,
        password: passwordGenerator.generate({
          numbers: true,
          symbols: true,
        }),
        ips: [ip],
      },
    })

    writeSuccess(`Sendgrid subuser created`)
  } catch (e) {
    console.error(e)
  }
}

module.exports = setupSendgridAccount
