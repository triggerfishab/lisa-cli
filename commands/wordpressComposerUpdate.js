import asyncExec from "../lib/exec.js"
import fs from "fs"
import { writeError } from "../lib/write.js"

export async function wpUpdate() {
  try {
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
