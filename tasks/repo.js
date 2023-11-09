import fetch from "node-fetch"

import { getApiName, getProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import {
  writeEmptyLine,
  writeError,
  writeInfo,
  writeSuccess,
} from "../lib/write.js"

/**
 * Create repos at GitHub for app and api for Lisa projects.
 * or Single repo for Wanda projects.
 *
 * @param {('lisa'|'wanda')} projectType - The type of project, either "lisa" or "wanda".
 * @return {Promise<void>}
 */
export async function createRepos(projectType = "lisa") {
  await checkGithubApiStatus()

  writeEmptyLine()
  if (projectType === "lisa") {
    await createLisaRepos()
  }
  if (projectType === "wanda") {
    await createWandaRepo()
  }
}
export async function createLisaRepos() {
  writeInfo("Setting up repos at GitHub for app and api.")

  const appName = conf.get("appName")
  const apiName = conf.get("apiName")

  const appGithubURL = `https://github.com/triggerfishab/${appName}`
  const apiGithubURL = `https://github.com/triggerfishab/${apiName}`

  const appResponse = await exec(
    `gh repo create --template triggerfishab/lisa-app triggerfishab/${appName} --private --clone`,
  )

  if (appResponse.error) {
    writeError(appResponse.error)
    process.exit()
  }

  writeSuccess(`App Repo created: ${appGithubURL}.`)

  const apiResponse = await exec(
    `gh repo create --template triggerfishab/lisa-api triggerfishab/${apiName} --private --clone`,
  )

  if (apiResponse.error) {
    writeError(apiResponse.error)
    process.exit()
  }

  writeSuccess(`Api Repo created: ${apiGithubURL}.`)
}

export async function createWandaRepo() {
  writeInfo("Setting up repo at GitHub for Wanda.")

  const projectName = await getProjectName()

  const apiGithubURL = `https://github.com/triggerfishab/${projectName}`

  const apiResponse = await exec(
    `gh repo fork triggerfishab/wanda --fork-name ${projectName} --org triggerfishab --clone`,
  )

  if (apiResponse.error) {
    writeError(apiResponse.error)
    process.exit()
  }

  writeSuccess(`Repo created: ${apiGithubURL}.`)
}

export async function addGithubRepoSecrets() {
  const vaultPass = conf.get("vaultPass")
  const apiRepo = await getApiName()

  await exec(`gh secret set VAULT_PASS -b"${vaultPass}"`, { cwd: apiRepo })
  writeSuccess("Vault pass saved as secret for api repo.")
}

export async function checkGithubApiStatus() {
  writeInfo("Checking GitHub API status.")
  const res = await fetch("https://www.githubstatus.com/api/v2/components.json")
  const json = await res.json()
  const { components } = json

  const filter = ["Git Operations", "API Requests"]

  const filteredComponents = components.filter((component) =>
    filter.includes(component.name),
  )

  if (
    filteredComponents.some((component) => component.status !== "operational")
  ) {
    writeError(
      "GitHub is having some issues right now, read more at: https://www.githubstatus.com/",
    )
    process.exit()
  }
}
