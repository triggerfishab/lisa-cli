const { program } = require("commander")
const { getProjectName } = require("../lib/app-name")
const store = require("../lib/store")
const fetch = require("node-fetch")
const conf = require("../lib/conf")
const setup = require("./setup")

program
  .command("godaddy")
  .description("Setup GoDaddy DNS records")
  .action(goDaddy)

async function goDaddy() {
  let goDaddy = conf.get("goDaddy") || (await setup("goDaddy")).goDaddy
  let projectName = await getProjectName()
  let stackpathCdnUrl = store.get("stackpathCdnUrl")

  await fetch("https://api.godaddy.com/v1/domains/triggerfish.cloud/records", {
    method: "PATCH",
    headers: {
      Authorization: `sso-key ${goDaddy.key}:${goDaddy.secret}`,
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
}

module.exports = goDaddy
