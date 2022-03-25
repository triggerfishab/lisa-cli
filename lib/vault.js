const conf = require("./conf")
const fs = require("fs")
const { getTrellisPath } = require("./trellis")
const prompts = require("prompts")
const { get } = require("./store")
const { writeError } = require("./write")
const { load } = require("js-yaml")

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

module.exports = {
  getLisaVaultPass,
  writeTempLisaVaultPass,
  removeTempLisaVaultPass,
  getLisaVaultPassPath,
  getVaultPassPath,
}
