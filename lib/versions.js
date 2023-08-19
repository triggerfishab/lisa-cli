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
  op: "2.18.0",
  trellisCli: "1.5.0",
  valet: "2.18.0",
  vercel: "28.0.0",
  wpCli: "2.8.1",
  composer: "2.5.8",
  php: "8.1.0",
}

const getVersions = async () => {
  let versionsOutput = await asyncExec(
    `npm outdated @triggerfishab/lisa-cli --json --global --all || true`,
  )
  return JSON.parse(versionsOutput.stdout.trim())
}

export async function checkLisaVersion() {
  const parsedOutput = await getVersions()
  if (Object.keys(parsedOutput).length === 0) {
    return
  }

  const versions = parsedOutput["@triggerfishab/lisa-cli"]
  const currentVersion = versions?.current
  const latestVersion = versions?.latest
  if (semver.compare(currentVersion, latestVersion) === -1) {
    writeSuccess(
      `A new version of ${chalk.bold(
        "lisa-cli",
      )} (${latestVersion}) is available, run ${chalk.bold(
        "npm install @triggerfishab/lisa-cli --global",
      )} to install it.`,
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
      writeInfo("npm install @triggerfishab/lisa-cli --global")
      process.exit()
    }
  }
}
