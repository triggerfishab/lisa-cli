import chalk from "chalk"
import conf from "./conf.js"
import exec from "./exec.js"
import { writeError } from "./write.js"

export async function validateCurrentPath(command) {
  if (!["path", "services", "configure", "kinsta"].includes(command)) {
    let sitesPath = getSitesPath()
    let pwd = await exec(`pwd`)

    if (sitesPath !== pwd.stdout.trim()) {
      writeError(
        `You are in the wrong directory, please run ${chalk.bold(
          chalk.underline(`cd ${sitesPath}`)
        )} and try again!`
      )
      process.exit()
    }
  }
}

export function getSitesPath() {
  let sitesPath = conf.get("sitesPath")

  if (!sitesPath) {
    writeError(
      `No site path was found, please run ${chalk.bold(
        chalk.underline("lisa path")
      )} to set one!`
    )

    process.exit()
  }

  return sitesPath
}
