const { program } = require("commander")
const { getProjectName } = require("../lib/app-name")
const store = require("../lib/store")
const fetch = require("node-fetch")
const conf = require("../lib/conf")
const configure = require("./configure")
const { writeStep, writeSuccess } = require("../lib/write")

program
  .command("godaddy")
  .description("Setup GoDaddy DNS records")
  .action(goDaddy)

async function goDaddy() {
  writeStep(`Setting up GoDaddy DNS record for your project.`)

  let godaddy = conf.get("godaddy") || (await configure("godaddy")).godaddy
  let projectName = await getProjectName()
  let stackpathCdnUrl = store.get("stackpathCdnUrl")

  await fetch("https://api.godaddy.com/v1/domains/triggerfish.cloud/records", {
    method: "PATCH",
    headers: {
      Authorization: `sso-key ${godaddy.key}:${godaddy.secret}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        data: stackpathCdnUrl,
        name: `${projectName}.cdn`,
        ttl: 1800,
        type: "CNAME",
      },
    ]),
  })

  writeSuccess(`GoDaddy DNS record added for your project.`)
}

module.exports = goDaddy
