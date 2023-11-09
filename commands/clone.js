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
import { writeInfo, writeStep, writeSuccess } from "../lib/write.js"
import installDependencies from "../tasks/dependencies.js"
import linkValetSite from "../tasks/valet.js"
import dbImport from "./db.js"

export default async function cloneLisaProject() {
  writeStep("Cloning Lisa project")

  const projectName = await askForProjectName()

  let apiRepoName = `git@github.com:triggerfishab/${projectName}-api.git`
  let appRepoName = `git@github.com:triggerfishab/${projectName}-app.git`

  conf.set("apiRepoName", apiRepoName)
  conf.set("appRepoName", appRepoName)

  await askForCorrectRepoNames()

  apiRepoName = conf.get("apiRepoName")
  appRepoName = conf.get("appRepoName")

  const apiName = apiRepoName.split("/")[1].replace(".git", "")
  const appName = appRepoName.split("/")[1].replace(".git", "")

  conf.set("apiName", apiName)
  conf.set("appName", appName)

  await exec(`git clone ${apiRepoName}`)
  await exec(`git clone ${appRepoName}`)

  await installDependencies()
  await linkValetSite()

  const trellisPath = getTrellisPath()

  const { vaultPass } = await prompts({
    type: "invisible",
    message:
      "Enter the vault pass for the project, can be found under the project item in 1Password",
    name: "vaultPass",
  })

  const vaultPassPath = `${trellisPath}/.vault_pass`

  fs.writeFile(vaultPassPath, vaultPass, (err) => {
    if (err) {
      console.log(err)
    }
  })

  await exec("trellis init", {
    cwd: trellisPath,
  })

  await exec("trellis dotenv", {
    cwd: trellisPath,
  })

  writeSuccess("Generated .env file with trellis-cli.")

  await exec("wp db create", {
    cwd: `${apiName}/site`,
  })

  writeSuccess("Created empty local database.")

  const { doDbImport } = await prompts([
    {
      type: "confirm",
      name: "doDbImport",
      message: "Do you want to import a database?",
    },
  ])

  if (doDbImport) {
    await dbImport()
  }

  spawnSync("vercel link --yes", [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  spawnSync("vercel env pull", [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  writeSuccess("Generated .env file with environment variables from Vercel.")

  const adminUrl = await getAdminUrl()

  writeSuccess(chalk.bold("All done!"))
  writeSuccess(`Admin URL: ${chalk.underline(adminUrl)}/wp/wp-admin`)
  writeSuccess(
    `Run this command for local development: ${chalk.underline(
      `cd ${appName} && yarn dev`,
    )}`,
  )
}
export async function cloneWandaProject(projectNameOption) {
  writeStep("Cloning Wanda project")
  let projectName = projectNameOption
  if (!projectName) {
    projectName = await askForProjectName()
  }
  let apiRepoName = `git@github.com:triggerfishab/${projectName}.git`

  conf.set("apiRepoName", apiRepoName)

  await askForCorrectRepoNames()

  apiRepoName = conf.get("apiRepoName")

  const apiName = apiRepoName.split("/")[1].replace(".git", "")

  conf.set("apiName", apiName)

  await exec(`git clone ${apiRepoName}`)

  await installDependencies()
  await linkValetSite()

  const trellisPath = getTrellisPath()

  writeInfo(
    `Fetching Wanda Project ${projectName} Vault Pass from 1Password...`,
  )
  await exec(`op item get op://Shared/${projectName}/vaultPass`)
    .then((res) => res.stdout.trim())
    .catch(async () => {
      writeInfo(
        `Can't find vault pass for ${projectName} in 1Password, please enter it manually.`,
      )
      const { vaultPass } = await prompts({
        type: "invisible",
        message: "Enter the vault pass for the project",
        name: "vaultPass",
      })

      const vaultPassPath = ".vault_pass"

      fs.writeFile(vaultPassPath, vaultPass, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })

  await exec("trellis init", {
    cwd: trellisPath,
  })

  await exec("trellis dotenv", {
    cwd: trellisPath,
  })

  writeSuccess("Generated .env file with trellis-cli.")

  await exec("wp db create", {
    cwd: `${apiName}/`,
  })

  writeSuccess("Created empty local database.")

  const { doDbImport } = await prompts([
    {
      type: "confirm",
      name: "doDbImport",
      message: "Do you want to import a database?",
    },
  ])

  if (doDbImport) {
    await dbImport()
  }

  const adminUrl = await getAdminUrl()

  writeSuccess(chalk.bold("All done!"))
  writeSuccess(`Admin URL: ${chalk.underline(adminUrl)}/wp/wp-admin`)
  writeSuccess(
    `Run this command for local development: ${chalk.underline("yarn dev")}`,
  )
}
