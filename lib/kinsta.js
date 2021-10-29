const prompt = require("prompt");
const chalk = require("chalk");

async function askForConfigFile() {
  prompt.start();
  prompt.message = "";
  prompt.delimiter = chalk.greenBright(" >");

  let configFilePrompt = {
    properties: {
      configFile: {
        type: "string",
        description:
          "Enter the name of your Kinsta configuration file (relative path)",
        required: true,
      },
    },
  };

  let { configFile } = await prompt.get(configFilePrompt);

  return configFile;
}

module.exports = { askForConfigFile };
