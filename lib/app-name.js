const prompt = require("prompt");
const chalk = require("chalk");
const conf = new (require("conf"))();

async function askForAppName() {
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
}

async function getProjectName() {
  let appName = conf.get("projectName");

  if (!appName) {
    await askForAppName();
  }

  return conf.get("projectName");
}

module.exports = { askForAppName, getProjectName };
