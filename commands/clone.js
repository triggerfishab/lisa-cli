import chalk from "chalk"
import { spawnSync } from "child_process"
import fs from "fs"
import prompts from "prompts"
import { askForProjectName } from "../lib/app-name.js"
import { askForCorrectRepoNames } from "../lib/clone.js"
import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { getTrellisPath } from "../lib/trellis.js"
import { getAdminUrl } from "../lib/wordpress.js"
import { writeStep, writeSuccess } from "../lib/write.js"
import installDependencies from "../tasks/dependencies.js"
import linkValetSite from "../tasks/valet.js"
import dbImport from "./db.js"

async function cloneLisaProject() {
  writeStep("Cloning Lisa project")

  let projectName = await askForProjectName()

  let apiRepoName = `git@github.com:triggerfishab/${projectName}-api.git`
  let appRepoName = `git@github.com:triggerfishab/${projectName}-app.git`

  conf.set("apiRepoName", apiRepoName)
  conf.set("appRepoName", appRepoName)

  await askForCorrectRepoNames()

  apiRepoName = conf.get("apiRepoName")
  appRepoName = conf.get("appRepoName")

  let apiName = apiRepoName.split("/")[1].replace(".git", "")
  let appName = appRepoName.split("/")[1].replace(".git", "")

  conf.set("apiName", apiName)
  conf.set("appName", appName)

  await exec(`git clone ${apiRepoName}`)
  await exec(`git clone ${appRepoName}`)

  await installDependencies()
  await linkValetSite()

  let trellisPath = getTrellisPath()

  let { vaultPass } = await prompts({
    type: "invisible",
    message:
      "Enter the vault pass for the project, can be found under the project item in 1Password",
    name: "vaultPass",
  })

  let vaultPassPath = `${trellisPath}/.vault_pass`

  fs.writeFile(vaultPassPath, vaultPass, (err) => {
    if (err) {
      console.log(err)
    }
  })

  await exec(`trellis init`, {
    cwd: trellisPath,
  })

  await exec(`trellis dotenv`, {
    cwd: trellisPath,
  })

  writeSuccess("Generated .env file with trellis-cli.")

  await exec(`wp db create`, {
    cwd: `${apiName}/site`,
  })

  writeSuccess("Created empty local database.")

  let { doDbImport } = await prompts([
    {
      type: "confirm",
      name: "doDbImport",
      message: "Do you want to import a database?",
    },
  ])

  if (doDbImport) {
    await dbImport()
  }

  spawnSync(`vercel link --confirm`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  spawnSync(`vercel pull`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  writeSuccess(
    "Generated .env.local file with environment variables from Vercel."
  )

  let adminUrl = await getAdminUrl()

  writeSuccess(chalk.bold("All done!"))
  writeSuccess(`Admin URL: ${chalk.underline(adminUrl)}/wp/wp-admin`)
  writeSuccess(
    `Run this command for local development: ${chalk.underline(
      `cd ${appName} && yarn dev`
    )}`
  )
}

export default cloneLisaProject
