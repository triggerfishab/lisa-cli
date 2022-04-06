import chalk from "chalk"
import conf from "./conf.js"
import exec from "./exec.js"
import { writeError } from "./write.js"

export function getSitesPath() {
  let sitesPath = conf.get("sitesPath")

  if (!sitesPath) {
    writeError(
      `No site path was found, please run ${chalk.bold(
        chalk.underline("lisa path")
      )} to set one!`
    )

    process.exit(1)
  }

  return sitesPath
}
