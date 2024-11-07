import { exec } from "child_process"

import { getAppName } from "./app-name.js"
import conf from "./conf.js"
import * as store from "./store.js"
import { getVaultPass } from "./vault.js"
import { writeError, writeSuccess } from "./write.js"

export async function addCredentialsTo1Password() {
  const apiUrl = conf.get("apiUrl")
  const appName = await getAppName()
  const vaultPass = getVaultPass()
  const { username, password } = store.get("admin")
  const sharedVault = "ryviwoy5u66roitf5rb2pc6lze"

  try {
    await exec(
      `op item create --category login --title=${appName} --url ${apiUrl}/wp/wp-admin username=${username} password=${password} vaultPass=${vaultPass} --vault ${sharedVault}`,
    )
    writeSuccess("Project credentials saved to 1Password!")
  } catch (error) {
    writeError(`Failed saving project credentials to 1Password. \n ${error}`)
    process.exit(1)
  }
}
