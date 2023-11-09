import chalk from "chalk"
import prompts from "prompts"

import conf from "../lib/conf.js"
import { writeError, writeSuccess } from "./write.js"

export async function askForProjectName(message = "", projectNameOption = "") {
  const { projectName, confirm } = await prompts([
    {
      type: "text",
      name: "projectName",
      message: message.length ? message : "Enter the name of your project",
      initial: projectNameOption,
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
          projectName,
        )}?`,
      initial: true,
    },
  ])

  if (!confirm) {
    writeError("Wrong project name, please try again.")
    process.exit()
  }

  conf.set("projectName", projectName)

  writeSuccess(`Project name set to ${projectName}`)

  const appName = `${projectName}-app`
  const apiName = `${projectName}-api`

  conf.set("appName", appName)
  conf.set("apiName", apiName)

  return projectName
}

export async function getProjectName() {
  const projectName = conf.get("projectName")

  if (!projectName) {
    await askForProjectName()
  }

  return conf.get("projectName")
}

export async function getApiName() {
  const apiName = conf.get("apiName")

  if (!apiName) {
    await askForProjectName()
  }

  return conf.get("apiName")
}

export async function getAppName() {
  const appName = conf.get("appName")

  if (!appName) {
    await askForProjectName()
  }

  return conf.get("appName")
}

export async function askForEmailAddress(initialEmailAddress = "") {
  console.log(initialEmailAddress)
  const { emailAddress, confirm } = await prompts([
    {
      type: "text",
      name: "emailAddress",
      message: "Enter your email address",
      validate: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? true
          : "Please enter a valid email address",
      initial: initialEmailAddress,
    },
    {
      type: "confirm",
      name: "confirm",
      message: (emailAddress) =>
        `Can you confirm that your email address is ${chalk.underline(
          emailAddress,
        )}?`,
      initial: true,
    },
  ])

  if (!confirm) {
    writeError("Wrong email address, please try again.")
    process.exit()
  }

  conf.set("emailAddress", emailAddress)

  writeSuccess(`Email address set to ${emailAddress}`)

  return emailAddress
}

export async function getEmailAddress(initialEmailAddress = "") {
  const emailAddress = conf.get("emailAddress")

  if (!emailAddress) {
    await askForEmailAddress(initialEmailAddress)
  }

  return conf.get("emailAddress")
}
