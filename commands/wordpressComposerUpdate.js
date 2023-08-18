#!/usr/bin/env node

import asyncExec from "../lib/exec.js"
import fs from "fs"
import { writeError, writeInfo } from "../lib/write.js"

async function isCommandAvailable(cmd) {
  try {
    await asyncExec(`command -v ${cmd}`, { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}
export async function wpUpdate() {
  try {
    if (!(await isCommandAvailable("jq"))) {
      writeInfo("jq is not installed. Attempting to install...")
      if (await isCommandAvailable("brew")) {
        await asyncExec("brew install jq")
      } else {
        writeError("Homebrew is not installed. Install Homebrew and try again.")

        process.exit(1)
      }
    }

    if (!(await isCommandAvailable("composer"))) {
      writeError("composer is not installed.")
      process.exit(1)
    }

    try {
      await asyncExec("composer validate --no-check-all --strict", {
        stdio: "inherit",
      })
    } catch {
      writeError("composer.json is not valid.")
      process.exit(1)
    }

    const composerJson = JSON.parse(fs.readFileSync("composer.json", "utf8"))
    if (composerJson.require.php !== ">=8.1") {
      composerJson.require.php = ">=8.1"
      fs.writeFileSync("composer.json", JSON.stringify(composerJson, null, 2))
    }

    for (const pluginName in composerJson.require) {
      if (pluginName !== "php") {
        await asyncExec(`composer require ${pluginName}`)
      }
    }
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
