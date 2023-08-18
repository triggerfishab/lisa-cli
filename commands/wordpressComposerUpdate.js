import asyncExec from "../lib/exec.js"
import fs from "fs"
import { writeError, writeInfo, writeSuccess } from "../lib/write.js"

export async function wpUpdate() {
  try {
    let composerValidateOutput = await asyncExec(
      "composer validate --no-check-all --strict --no-interaction",
      {
        cwd: process.env.PWD,
      },
    )

    writeSuccess(composerValidateOutput.stderr.trim())

    const composerJson = JSON.parse(
      fs.readFileSync(process.env.PWD + "/composer.json", "utf8"),
    )
    if (composerJson.require.php !== ">=8.1") {
      composerJson.require.php = ">=8.1"
      fs.writeFileSync(
        process.env.PWD + "/composer.json",
        JSON.stringify(composerJson, null, 2),
      )
    }

    for (const pluginName in composerJson.require) {
      if (pluginName !== "php") {
        let composerRequireOutput = await asyncExec(
          `composer require ${pluginName} --with-all-dependencies --no-interaction`,
          {
            cwd: process.env.PWD,
          },
        )
        writeSuccess(composerRequireOutput.stderr.trim())
      }
    }
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
