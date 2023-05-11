import fetch from "node-fetch"
import { getApiName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import {
  writeEmptyLine,
  writeError,
  writeInfo,
  writeSuccess,
} from "../lib/write.js"

export async function createRepos() {
  await checkGithubApiStatus()

  writeEmptyLine()
  writeInfo("Setting up repos at GitHub for app and api.")

  let appName = conf.get("appName")
  let apiName = conf.get("apiName")

  let appGithubURL = `https://github.com/triggerfishab/${appName}`
  let apiGithubURL = `https://github.com/triggerfishab/${apiName}`

  let appResponse = await exec(
    `gh repo create --template triggerfishab/lisa-app triggerfishab/${appName} --private --clone`
  )

  if (appResponse.error) {
    writeError(error)
    process.exit()
  }

  writeSuccess(`Repo created: ${appGithubURL}.`)

  let apiResponse = await exec(
    `gh repo create --template triggerfishab/lisa-api triggerfishab/${apiName} --private --clone`
  )

  if (apiResponse.error) {
    writeError(error)
    process.exit()
  }

  writeSuccess(`Repo created: ${apiGithubURL}.`)
}

export async function addGithubRepoSecrets() {
  let vaultPass = conf.get("vaultPass")
  let apiRepo = await getApiName()

  await exec(`gh secret set VAULT_PASS -b"${vaultPass}"`, { cwd: apiRepo })
  writeSuccess("Vault pass saved as secret for api repo.")
}

async function checkGithubApiStatus() {
  const res = await fetch("https://www.githubstatus.com/api/v2/components.json")
  const json = await res.json()
  const { components } = json

  const filter = ["Git Operations", "API Requests"]

  const filteredComponents = components.filter((component) =>
    filter.includes(component.name)
  )

  if (
    filteredComponents.some((component) => component.status !== "operational")
  ) {
    writeError(
      "GitHub is having some issues right now, read more at: https://www.githubstatus.com/"
    )
    process.exit()
  }
}
