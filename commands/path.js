import chalk from "chalk"
import { constants } from "fs"
import { access } from "fs/promises"

import conf from "../lib/conf.js"
import { getSitesPath } from "../lib/path.js"
import { writeError, writeInfo, writeSuccess } from "../lib/write.js"

async function setupPath(path) {
  if (!path) {
    const currentPath = await getSitesPath()

    if (currentPath) {
      writeInfo(`Your path is: ${currentPath}`)
    } else {
      writeError("No path is set, run `lisa path [path]` to set a path.")
    }

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
