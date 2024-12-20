import fs from "fs"
import { dump, load } from "js-yaml"
import prompts from "prompts"

import conf from "./conf.js"
import exec from "./exec.js"
import { getGroupVarsPath, getTrellisPath } from "./trellis.js"
import { writeError, writeInfo, writeSuccess } from "./write.js"

export async function getLisaVaultPass() {
  try {
    writeInfo("Fetching Lisa Vault Pass from 1Password...")
    return await exec(
      "op item get z3vqskkf7vjowsqnulf5aw4hf4 --fields label=vault_pass",
    ).then((res) => res.stdout.trim())
  } catch (error) {
    return await askForLisaVaultPass()
  }
}

export async function askForLisaVaultPass() {
  const { lisaVaultPass } = await prompts({
    type: "text",
    name: "lisaVaultPass",
    message:
      "Enter the Vault Pass for the Lisa project (can be found in the Lisa item in 1Password).",
  })

  conf.set("lisaVaultPass", lisaVaultPass)

  return lisaVaultPass
}

export function getLisaVaultPassPath() {
  const trellisPath = getTrellisPath()
  return `${trellisPath}/.lisa_vault_pass`
}

export function getVaultPassPath() {
  const trellisPath = getTrellisPath()
  return `${trellisPath}/.vault_pass`
}

export function getVaultPass() {
  const vaultPassPath = `${getTrellisPath()}/.vault_pass`

  return fs.readFileSync(vaultPassPath, { encoding: "utf-8" }).toString().trim()
}

export async function writeTempLisaVaultPass() {
  const lisaVaultPass = await getLisaVaultPass()
  const lisaVaultPassFile = getLisaVaultPassPath()
  fs.writeFile(lisaVaultPassFile, lisaVaultPass, () => {})
}

export async function removeTempLisaVaultPass() {
  const lisaVaultPassFile = getLisaVaultPassPath()

  fs.unlink(lisaVaultPassFile, () => {})
}

export async function getVault(environment) {
  const vaultFilePath = `${getTrellisPath()}/group_vars/${environment}/vault.yml`

  if (!fs.existsSync(vaultFilePath)) {
    writeError(
      `No file found at ${vaultFilePath}. Did you provide an incorrect environment?`,
    )
    process.exit(1)
  }

  return load(fs.readFileSync(vaultFilePath, { encoding: "utf-8" }))
}

export async function writeEnvDataToVault(data, environment) {
  if (!["all", "development", "staging", "production"].includes(environment)) {
    writeError("Incorrect environment provided, please try again...")
    process.exit()
  }

  const vaultPassPath = getVaultPassPath()
  const groupVarsPath = getGroupVarsPath(environment)
  const vaultFile = `${groupVarsPath}/vault.yml`

  await exec(
    `ansible-vault decrypt ${vaultFile} --vault-password-file ${vaultPassPath}`,
  )

  const vaultFileData = load(fs.readFileSync(vaultFile, "utf8"))

  if (environment === "all") {
    vaultFileData.vault_wordpress_env_defaults = {
      ...vaultFileData.vault_wordpress_env_defaults,
      ...data,
    }
  } else {
    for (const siteKey in vaultFileData.vault_wordpress_sites) {
      vaultFileData.vault_wordpress_sites[siteKey].env = {
        ...vaultFileData.vault_wordpress_sites[siteKey].env,
        ...data,
      }
    }
  }

  fs.writeFile(vaultFile, dump(vaultFileData), () =>
    writeSuccess(`${vaultFile} updated.`),
  )

  await exec(
    `ansible-vault encrypt ${vaultFile} --vault-password-file ${vaultPassPath}`,
  )
}

export async function writeEnvDataToWordPressSites(data, environment) {
  if (!["development", "staging", "production"].includes(environment)) {
    writeError("Incorrect environment provided, please try again...")
    process.exit()
  }

  const groupVarsPath = getGroupVarsPath(environment)
  const wordPressSitesFile = `${groupVarsPath}/wordpress_sites.yml`

  const wordPressSitesFileData = load(
    fs.readFileSync(wordPressSitesFile, "utf8"),
  )

  for (const siteKey in wordPressSitesFileData.wordpress_sites) {
    wordPressSitesFileData.wordpress_sites[siteKey].env = {
      ...wordPressSitesFileData.wordpress_sites[siteKey].env,
      ...data,
    }
  }

  fs.writeFile(wordPressSitesFile, dump(wordPressSitesFileData), () =>
    writeSuccess(`${wordPressSitesFile} updated.`),
  )
}
