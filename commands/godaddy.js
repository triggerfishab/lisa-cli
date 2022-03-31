const { program } = require("commander")
const { getProjectName } = require("../lib/app-name")
const store = require("../lib/store")
const fetch = require("node-fetch")

program
  .command("godaddy")
  .description("Setup GoDaddy DNS records")
  .action(goDaddy)

async function goDaddy() {
  console.log(`setup dns for: ${store.get("stackpathCdnUrl")}`)

  console.log("lets go daddy")
}

module.exports = goDaddy
