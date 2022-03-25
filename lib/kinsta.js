const prompts = require("prompts")

async function askForConfigFile() {
  let { configFile } = await prompts({
    type: "text",
    name: "configFile",
    message: "Enter the name of your Kinsta configuration file (relative path)",
  })

  return configFile
}

module.exports = { askForConfigFile }
