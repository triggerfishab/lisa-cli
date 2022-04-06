import chalk from "chalk"
import { constants } from "fs"
import { access } from "fs/promises"
import conf from "../lib/conf.js"
import { writeError, writeSuccess } from "../lib/write.js"

async function setupPath(path) {
  if (!path) {
    let sitesPath = conf.get("sitesPath")

    console.log(sitesPath)
    return
  }

  try {
    await access(path, constants.R_OK | constants.W_OK)

    conf.set("sitesPath", path)
    writeSuccess(`Your path was set to ${chalk.underline(path)}.`)
  } catch {
    writeError(`Can not access ${path}. Too bad, bye bye!`)
  }
}

export default setupPath
