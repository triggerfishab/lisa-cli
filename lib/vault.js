const conf = require("./conf")
const fs = require("fs")
const { getTrellisPath, getGroupVarsPath } = require("./trellis")
const prompts = require("prompts")
const { get } = require("./store")
const { writeError, writeSuccess } = require("./write")
const { load, dump } = require("js-yaml")
const exec = require("./exec")

async function getLisaVaultPass() {
  return conf.get("lisaVaultPass") || (await askForLisaVaultPass())
}

async function askForLisaVaultPass() {
  let { lisaVaultPass } = await prompts({
    type: "text",
    name: "lisaVaultPass",
    message:
      "Enter the Vault Pass for the Lisa project (can be found in the Lisa item in 1Password).",
  })

  conf.set("lisaVaultPass", lisaVaultPass)

  return lisaVaultPass
}

function getLisaVaultPassPath() {
  let trellisPath = getTrellisPath()
  return `${trellisPath}/.lisa_vault_pass`
}

function getVaultPassPath() {
  let trellisPath = getTrellisPath()
  return `${trellisPath}/.vault_pass`
}

function getVaultPass() {
  const vaultPassPath = `${getTrellisPath()}/.vault_pass`

  return fs.readFileSync(vaultPassPath, { encoding: "utf-8" }).toString().trim()
}

async function writeTempLisaVaultPass() {
  let lisaVaultPass = await getLisaVaultPass()
  let lisaVaultPassFile = getLisaVaultPassPath()
  fs.writeFile(lisaVaultPassFile, lisaVaultPass, () => {})
}

async function removeTempLisaVaultPass() {
  let lisaVaultPassFile = getLisaVaultPassPath()

  fs.unlink(lisaVaultPassFile, () => {})
}

async function getVault(environment) {
  let vaultPass = get("vaultPass")

  if (!vaultPass) {
    vaultPass = getVaultPass()
  }

  if (vaultPass) {
    vaultPass = getLisaVaultPass()
  }

  const vaultFilePath = `${getTrellisPath()}/group_vars/${environment}/vault.yml`

  if (!fs.existsSync(vaultFilePath)) {
    writeError(
      `No file found at ${vaultFilePath}. Did you provide an incorrect environment?`
    )
    process.exit(1)
  }

  return load(fs.readFileSync(vaultFilePath, { encoding: "utf-8" }))
}

async function writeEnvValueToVault(data, environment) {
  if (!["all", "development", "staging", "production"].includes(environment)) {
    writeError("Incorrect environment provided, please try again...")
    process.exit()
  }

  conf.set("apiName", "lisa-api")

  let vaultPassPath = getVaultPassPath()
  let groupVarsPath = getGroupVarsPath(environment)
  let vaultFile = `${groupVarsPath}/vault.yml`

  await exec(
    `ansible-vault decrypt ${vaultFile} --vault-password-file ${vaultPassPath}`
  )

  let vaultFileData = load(fs.readFileSync(vaultFile, "utf8"))

  if (environment === "all") {
    vaultFileData.vault_wordpress_env_defaults = {
      ...vaultFileData.vault_wordpress_env_defaults,
      ...data,
    }
  } else {
    for (let siteKey in vaultFileData.vault_wordpress_sites) {
      vaultFileData.vault_wordpress_sites[siteKey].env = {
        ...vaultFileData.vault_wordpress_sites[siteKey].env,
        ...data,
      }
    }
  }

  fs.writeFile(vaultFile, dump(vaultFileData), () =>
    writeSuccess(`${vaultFile} updated.`)
  )

  await exec(
    `ansible-vault encrypt ${vaultFile} --vault-password-file ${vaultPassPath}`
  )
}

module.exports = {
  getLisaVaultPass,
  writeTempLisaVaultPass,
  removeTempLisaVaultPass,
  getLisaVaultPassPath,
  getVaultPassPath,
  writeEnvValueToVault,
}
