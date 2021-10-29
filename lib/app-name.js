const prompt = require("prompt");
const chalk = require("chalk");
const conf = new (require("conf"))();

async function askForProjectName() {
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

  return projectName;
}

async function getProjectName() {
  let projectName = conf.get("projectName");

  if (!projectName) {
    await askForProjectName();
  }

  return conf.get("projectName");
}

async function getApiName() {
  let apiName = conf.get("apiName");

  if (!apiName) {
    await askForProjectName();
  }

  return conf.get("apiName");
}

module.exports = { askForProjectName, getProjectName, getApiName };
