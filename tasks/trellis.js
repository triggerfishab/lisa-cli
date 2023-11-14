import fs from "fs"
import generator from "generate-password"

import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { getGroupVarsPath, getTrellisPath } from "../lib/trellis.js"
import {
  getLisaVaultPassPath,
  getVaultPassPath,
  removeTempLisaVaultPass,
  writeTempLisaVaultPass,
} from "../lib/vault.js"
import { writeStep, writeSuccess } from "../lib/write.js"

export async function generateVaultPass(
  vaultPassPath = `${process.cwd()}/.vault_pass`,
) {
  console.log(vaultPassPath)
  const password = generator.generate({
    length: 64,
    numbers: true,
  })

  fs.writeFile(vaultPassPath, password, { encoding: "utf8" }, (err) => {
    if (err) {
      console.log(err)
    }
  })
  conf.set("vaultPass", password)

  writeSuccess(`Vault pass written to ${vaultPassPath}`)
}

export async function addVaultPassword() {
  const trellisPath = getTrellisPath()
  const vaultPassPath = `${trellisPath}/.vault_pass`
  await generateVaultPass(vaultPassPath)
}

export async function changeVaultPasswords() {
  writeStep("Update all vault files with new vault pass")

  const lisaVaultPassPath = getLisaVaultPassPath()
  const vaultPassPath = getVaultPassPath()

  const allGroupVarsPath = getGroupVarsPath("all")
  const developmentGroupVarsPath = getGroupVarsPath("development")
  const stagingGroupVarsPath = getGroupVarsPath("staging")
  const productionGroupVarsPath = getGroupVarsPath("production")

  await writeTempLisaVaultPass()

  await exec(
    `ansible-vault decrypt ${allGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`,
  )
  await exec(
    `ansible-vault encrypt ${allGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`,
  )

  writeSuccess(`Vault pass updated on ${allGroupVarsPath}/vault.yml.`)

  await exec(
    `ansible-vault decrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`,
  )
  await exec(
    `ansible-vault encrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`,
  )

  writeSuccess(`Vault pass updated on ${developmentGroupVarsPath}/vault.yml.`)

  await exec(
    `ansible-vault decrypt ${stagingGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`,
  )
  await exec(
    `ansible-vault encrypt ${stagingGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`,
  )

  writeSuccess(`Vault pass updated on ${stagingGroupVarsPath}/vault.yml.`)

  await exec(
    `ansible-vault decrypt ${productionGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`,
  )
  await exec(
    `ansible-vault encrypt ${productionGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`,
  )

  writeSuccess(`Vault pass updated on ${productionGroupVarsPath}/vault.yml.`)

  await removeTempLisaVaultPass()
}
