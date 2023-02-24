import chalk from "chalk"
import prompts from "prompts"
import semver from "semver"
import asyncExec from "./exec.js"
import { writeInfo, writeSuccess } from "./write.js"

export const versions = {
  ansibleVault: "2.12.0",
  aws: "2.4.0",
  gh: "2.6.0",
  node: "16.0.0",
  trellisCli: "1.5.0",
  valet: "2.18.0",
  vercel: "28.0.0",
  wpCli: "2.4.0",
}

export async function checkLisaVersion() {
  let localVersion = await asyncExec(
    `npm show version@triggerfishab/lisa-cli version`
  )
  let npmVersion = await asyncExec(
    `npm show version@triggerfishab/lisa-cli dist-tags.latest`
  )

  localVersion = localVersion.stdout.trim()
  npmVersion = npmVersion.stdout.trim()

  if (semver.compare(localVersion, npmVersion) === -1) {
    writeSuccess(
      `A new version of ${chalk.bold(
        "lisa-cli"
      )} (${npmVersion}) is available, run ${chalk.bold(
        "yarn global add @triggerfishab/lisa-cli@latest"
      )} to install it.`
    )

    let { continueProgram } = await prompts([
      {
        type: "confirm",
        message: "Do you want to continue?",
        name: "continueProgram",
        default: false,
      },
    ])

    if (!continueProgram) {
      writeInfo("Exiting Lisa CLI, please upgrade the package and try again.")
      writeInfo("yarn global add @triggerfishab/lisa-cli@latest")
      process.exit()
    }
  }
}
