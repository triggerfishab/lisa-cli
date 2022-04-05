const { program } = require("commander")
const { createRepos } = require("./repo")
const { askForProjectName } = require("../lib/app-name")
const setupLocalSiteForDevelopment = require("./local")
const { configureTrellisForKinsta } = require("../lib/kinsta")
const { getSitesPath } = require("../lib/path")
const { generateSecrets } = require("../lib/secrets")
const addSiteToVercel = require("../lib/vercel")
const { writeStep } = require("../lib/write")
const { writeSummary } = require("../lib/summary")
const setupServices = require("./services")
const chalk = require("chalk")

program
  .command("init")
  .description("Create a Lisa project")
  .requiredOption(
    "-c, --config-file <file>",
    `File with configuration options from Kinsta (relative or absolute path). Generate this file with ${chalk.bold(
      chalk.underline("lisa kinsta")
    )}`
  )
  .action(init)

async function init({ configFile }) {
  console.log({ configFile })
  await getSitesPath()

  writeStep("Creating new Lisa project!")

  await askForProjectName()
  await createRepos()
  await setupLocalSiteForDevelopment()
  await configureTrellisForKinsta(configFile || "")
  await addSiteToVercel()
  await generateSecrets()
  await setupServices()
  await writeSummary()

  writeStep("All done! Good luck and have fun!")
}

module.exports = init
