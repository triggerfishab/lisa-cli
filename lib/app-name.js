import chalk from "chalk"
import prompts from "prompts"
import conf from "../lib/conf.js"
import { writeError, writeSuccess } from "./write.js"

export async function askForProjectName() {
  let { projectName, confirm } = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Enter the name of your project",
      validate: (value) =>
        /^[a-z0-9-]+$/.test(value)
          ? true
          : "Please use only lowercase and hyphens only",
    },
    {
      type: "confirm",
      name: "confirm",
      message: (projectName) =>
        `Can you confirm that your project name is ${chalk.underline(
          projectName
        )}?`,
      initial: false,
    },
  ])

  if (!confirm) {
    writeError("Wrong project name, please try again.")
    process.exit()
  }

  conf.set("projectName", projectName)

  writeSuccess(`Project name set to ${projectName}`)

  let appName = `${projectName}-app`
  let apiName = `${projectName}-api`

  conf.set("appName", appName)
  conf.set("apiName", apiName)

  return projectName
}

export async function getProjectName() {
  let projectName = conf.get("projectName")

  if (!projectName) {
    await askForProjectName()
  }

  return conf.get("projectName")
}

export async function getApiName() {
  let apiName = conf.get("apiName")

  if (!apiName) {
    await askForProjectName()
  }

  return conf.get("apiName")
}

export async function getAppName() {
  let appName = conf.get("appName")

  if (!appName) {
    await askForProjectName()
  }

  return conf.get("appName")
}
