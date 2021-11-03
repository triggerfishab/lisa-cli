const chalk = require("chalk");
const { createRepos } = require("./repo");
const { askForProjectName } = require("../lib/app-name");
const setupLocalSiteForDevelopment = require("./local");
const configureTrellisForKinsta = require("./kinsta");
const { getSitesPath } = require("../lib/path");

async function init() {
  let sitesPath = getSitesPath();

  console.log(
    chalk.greenBright.bold("⚡️⚡️⚡️ Creating new Lisa project ⚡⚡️⚡️️")
  );
  console.log();

  let nodeVersion = process.version.match(/^v(\d+)/)[1];

  if (nodeVersion < 12) {
    console.log();
    console.log(
      chalk.bgRedBright.bold(
        `🚔🚔🚔 You are running node version ${nodeVersion}. Please update to latest Node version. 🚔🚔🚔`
      )
    );
    process.exit();
  }

  await askForProjectName();
  await createRepos();
  await setupLocalSiteForDevelopment();
  await configureTrellisForKinsta();

  console.log();
  console.log(chalk.greenBright.bold("⚡️⚡️⚡️ All done! ⚡⚡️⚡️️"));
}

module.exports = init;
