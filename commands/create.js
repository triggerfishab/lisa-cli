const prompt = require("prompt");
const chalk = require("chalk");
const conf = new (require("conf"))();
const { exec } = require("child_process");
const createRepos = require("../tasks/github");
const {
  installAppDependencies,
  installApiDependencies,
} = require("../tasks/dependencies");

async function create() {
  console.log(chalk.greenBright.bold("⚡️ Creating new Lisa project ⚡️"));
  console.log();

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
        pattern: /^[a-z-]+$/,
      },
    },
  };

  let { projectName } = await prompt.get(projectNamePrompt);

  conf.set("projectName", projectName);

  console.log();
  console.log(chalk.greenBright(`✅ Project name set to ${projectName}`));

  await createRepos();

  console.log();
  console.log(chalk.cyanBright("🪚 Install dependencies."));

  let appPromise = installAppDependencies();
  let apiPromise = installApiDependencies();

  await Promise.all([appPromise, apiPromise]);
  console.log(chalk.greenBright("✅ All dependencies installed."));
}

module.exports = create;
