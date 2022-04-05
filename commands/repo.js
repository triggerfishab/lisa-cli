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
  writeEmptyLine()
  writeInfo("Setting up repos at GitHub for app and api.")

  let appName = conf.get("appName")
  let apiName = conf.get("apiName")

  let appGithubURL = `https://github.com/triggerfishab/${appName}`
  let apiGithubURL = `https://github.com/triggerfishab/${apiName}`

  let appResponse = await exec(
    `gh repo create -p triggerfishab/lisa-app ${appGithubURL} -y --private -c`
  )

  if (appResponse.error) {
    writeError(error)
    process.exit()
  }

  writeSuccess(`Repo created: ${appGithubURL}.`)

  let apiResponse = await exec(
    `gh repo create -p triggerfishab/lisa-api ${apiGithubURL} -y --private -c`
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
