const conf = require("../lib/conf")
const { program } = require("commander")
const { getApiName } = require("../lib/app-name")
const exec = require("../lib/exec")
const {
  writeInfo,
  writeEmptyLine,
  writeError,
  writeSuccess,
} = require("../lib/write")

async function createRepos() {
  let { skipGithub } = program.opts()

  if (skipGithub) {
    return
  }

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

async function addGithubRepoSecrets() {
  let vaultPass = conf.get("vaultPass")
  let apiRepo = await getApiName()

  await exec(`gh secret set VAULT_PASS -b"${vaultPass}"`, { cwd: apiRepo })
  writeSuccess("Vault pass saved as secret for api repo.")
}

module.exports = { createRepos, addGithubRepoSecrets }
