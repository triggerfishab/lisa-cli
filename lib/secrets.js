import { spawnSync } from "child_process"
import fs from "fs"
import generator from "generate-password"
import yaml from "js-yaml"
import exec from "../lib/exec.js"
import * as store from "../lib/store.js"
import { getValetTld } from "../tasks/valet.js"
import { getApiName, getAppName, getProjectName } from "./app-name.js"
import { getGroupVarsPath, getTrellisPath } from "./trellis.js"
import { writeStep, writeSuccess } from "./write.js"

export async function generateSecrets() {
  await getProjectName()

  let appName = await getAppName()
  let apiName = await getApiName()
  let trellisPath = getTrellisPath()

  let jwtSecret = generator.generate({
    length: 32,
    numbers: true,
  })

  let apiSecret = generator.generate({
    length: 32,
    numbers: true,
  })

  let allGroupVarsPath = getGroupVarsPath("all")

  await exec(`ansible-vault decrypt group_vars/all/vault.yml`, {
    cwd: trellisPath,
  })

  let allVaultFile = yaml.load(
    fs.readFileSync(`${allGroupVarsPath}/vault.yml`, "utf-8")
  )

  allVaultFile.vault_wordpress_env_defaults.graphql_jwt_auth_secret_key =
    jwtSecret
  allVaultFile.vault_wordpress_env_defaults.next_api_secret = apiSecret

  fs.writeFile(`${allGroupVarsPath}/vault.yml`, yaml.dump(allVaultFile), () =>
    writeSuccess(`${allGroupVarsPath}/vault.yml updated with new secrets.`)
  )

  await exec(`ansible-vault encrypt group_vars/all/vault.yml`, {
    cwd: trellisPath,
  })

  writeStep("Installing WordPress.")

  let tld = await getValetTld()
  let apiUrl = `https://${apiName}.${tld}`
  let username = "triggerfish_root"
  let password = generator.generate({
    numbers: true,
    length: 32,
    strict: true,
  })

  store.set("admin", { username, password })

  await exec(
    `wp core install --url=${apiUrl} --title="Lisa" --admin_user=${username} --admin_password="${password}" --admin_email=signup@triggerfish.se --skip-email`,
    {
      cwd: `${apiName}/site`,
    }
  )

  writeSuccess("WordPress installed.")

  await exec('wp option set permalink_structure "/%postname%/"', {
    cwd: `${apiName}/site`,
  })

  writeSuccess("WordPress permalinks structure set to pretty permalinks.")

  await exec("wp theme activate lisa", {
    cwd: `${apiName}/site`,
  })

  writeSuccess("Lisa theme activated.")

  await exec("wp option update page_on_front 2", {
    cwd: `${apiName}/site`,
  })

  await exec("wp option update show_on_front page", {
    cwd: `${apiName}/site`,
  })

  writeSuccess('Update front page to "Sample page"')

  writeStep("Adding environment variables to Vercel")

  await exec(
    `printf ${apiUrl}/wp/graphql | vercel env add NEXT_PUBLIC_API_URL development`,
    { cwd: appName }
  )

  writeSuccess("NEXT_PUBLIC_API_URL environment variable saved to Vercel.")

  await exec(`printf "${apiSecret}" | vercel env add API_SECRET production`, {
    cwd: appName,
  })
  await exec(`printf "${apiSecret}" | vercel env add API_SECRET preview`, {
    cwd: appName,
  })
  await exec(`printf "${apiSecret}" | vercel env add API_SECRET development`, {
    cwd: appName,
  })

  writeSuccess("API_SECRET environment variable saved to Vercel.")

  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET production`,
    { cwd: appName }
  )
  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET preview`,
    { cwd: appName }
  )
  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET development`,
    { cwd: appName }
  )

  writeSuccess(
    "FORGOT_PASSWORD_JWT_SECRET environment variable saved to Vercel."
  )

  await exec("trellis dotenv", { cwd: trellisPath })

  writeSuccess("Trellis dotenv done.")

  spawnSync(`vercel pull`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  writeSuccess(".env.local created with environments variables from Vercel.")
}
