const chalk = require("chalk");
const createRepos = require("../tasks/github");
const {
  installAppDependencies,
  installApiDependencies,
} = require("../tasks/dependencies");
const linkValetSite = require("../tasks/valet");
const { addVaultPassword } = require("../tasks/trellis");
const { askForProjectName } = require("../lib/app-name");

async function create() {
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

  let projectName = await askForProjectName();

  console.log();
  console.log(chalk.greenBright(`🎉 Project name set to ${projectName}`));

  await createRepos();

  console.log();
  console.log(chalk.cyanBright("🪚 Install dependencies."));

  let appPromise = installAppDependencies();
  let apiPromise = installApiDependencies();

  await Promise.all([appPromise, apiPromise]);
  console.log(chalk.greenBright("🎉 All dependencies installed."));

  await linkValetSite();
  await addVaultPassword();
  await changeVaultPasswords();

  chalk.greenBright.bold("⚡️⚡️⚡️ All done! ⚡⚡️⚡️️");
}

module.exports = create;
