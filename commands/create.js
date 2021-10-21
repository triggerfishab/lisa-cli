const prompt = require("prompt");
const chalk = require("chalk");
const conf = new (require("conf"))();
const createRepos = require("../tasks/github");
const {
  installAppDependencies,
  installApiDependencies,
} = require("../tasks/dependencies");
const linkValetSite = require("../tasks/valet");
const { addVaultPassword } = require("../tasks/trellis");

async function create({ skipGithub }) {
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

  prompt.start();
  prompt.message = "";
  prompt.delimiter = chalk.greenBright(" >");

  let projectNamePrompt = {
    properties: {
      projectName: {
        type: "string",
        description: "Enter the name of your new project",
        message: "Please use only lowercase and hyphens only.",
        required: true,
        pattern: /^[a-z0-9-]+$/,
      },
    },
  };

  let { projectName } = await prompt.get(projectNamePrompt);

  conf.set("projectName", projectName);

  let appName = `${projectName}-app`;
  let apiName = `${projectName}-api`;

  conf.set("appName", appName);
  conf.set("apiName", apiName);

  console.log();
  console.log(chalk.greenBright(`🎉 Project name set to ${projectName}`));

  await createRepos(skipGithub);

  console.log();
  console.log(chalk.cyanBright("🪚 Install dependencies."));

  let appPromise = installAppDependencies();
  let apiPromise = installApiDependencies();

  await Promise.all([appPromise, apiPromise]);
  console.log(chalk.greenBright("🎉 All dependencies installed."));

  await linkValetSite();
  await addVaultPassword();

  chalk.greenBright.bold("⚡️⚡️⚡️ All done! ⚡⚡️⚡️️");
}

module.exports = create;
