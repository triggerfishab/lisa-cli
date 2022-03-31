const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const { writeStep, writeInfo } = require("../lib/write")
const conf = require("../lib/conf")
const fetch = require("node-fetch")

program
  .command("sendgrid")
  .description("Setup Sendgrid account")
  .action(setupSendgridAccount)

async function setupSendgridAccount() {
  let projectName = await getProjectName()
  let sendgrid = conf.get("sendgrid") || (await setup("sendgrid")).sendgrid
  let { apiKey } = sendgrid

  writeStep("Setup Sendgrid account")

  let data = await request("/subusers", {
    username: projectName,
    email: `${projectName}@sendgrid.triggerfish.se`,
    password: "",
    ips: ["167.89.92.184"],
  })

  writeInfo(projectName)
  writeInfo(apiKey)
}

async function request(endpoint, postData) {
  let { apiKey } = conf.get("sendgrid") || (await setup("sendgrid")).sendgrid

  let response = await fetch("https://api.sendgrid.com/v3" + endpoint, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
  })

  return response.json()
}

module.exports = setupSendgridAccount
