const prompts = require("prompts")
const { writeEmptyLine, writeSuccess } = require("./write")
const conf = require("../lib/conf")

async function askForProjectName() {
  let { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "Enter the name of your project",
    validate: (value) =>
      /^[a-z0-9-]+$/.test(value)
        ? true
        : "Please use only lowercase and hyphens only",
  })

  conf.set("projectName", projectName)

  writeSuccess(`Project name set to ${projectName}`)

  let appName = `${projectName}-app`
  let apiName = `${projectName}-api`

  conf.set("appName", appName)
  conf.set("apiName", apiName)

  return projectName
}

async function getProjectName() {
  let projectName = conf.get("projectName")

  if (!projectName) {
    await askForProjectName()
  }

  return conf.get("projectName")
}

async function getApiName() {
  let apiName = conf.get("apiName")

  if (!apiName) {
    await askForProjectName()
  }

  return conf.get("apiName")
}

async function getAppName() {
  let appName = conf.get("appName")

  if (!appName) {
    await askForProjectName()
  }

  return conf.get("appName")
}

module.exports = { askForProjectName, getProjectName, getApiName, getAppName }
