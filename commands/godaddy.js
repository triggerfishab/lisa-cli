const { program } = require("commander")
const { getProjectName } = require("../lib/app-name")

program
  .command("godaddy")
  .description("Setup GoDaddy DNS records")
  .action(goDaddy)

async function goDaddy() {
  await getProjectName()

  console.log("lets go daddy")
}

module.exports = goDaddy
