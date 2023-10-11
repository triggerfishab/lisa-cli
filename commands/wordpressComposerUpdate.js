import fs from "fs"
import semver from "semver"

import asyncExec from "../lib/exec.js"
import { versions } from "../lib/versions.js"
import {
  writeError,
  writeInfo,
  writeSuccess,
  writeWarning,
} from "../lib/write.js"

export async function wpUpdate() {
  const asyncExecOptions = {
    stdio: "inherit",
    cwd: process.env.PWD,
  }

  const parsedPhpVersion = semver.parse(versions.php, {})
  const phpVersion = `>=${parsedPhpVersion.major}.${parsedPhpVersion.minor}`

  try {
    const composerValidateOutput = await asyncExec(
      "composer validate --no-check-all --strict --no-interaction --ansi",
      asyncExecOptions,
    )
    console.log(composerValidateOutput.stdout)

    const composerJson = JSON.parse(
      fs.readFileSync(process.env.PWD + "/composer.json", "utf8"),
    )

    for (const [requiredComposerPackage] of Object.entries(
      composerJson.require,
    )) {
      let requireCommand = ""
      if (requiredComposerPackage === "php") {
        requireCommand = `composer require "${requiredComposerPackage}:${phpVersion}" --with-all-dependencies --no-interaction  --ansi`
      }
      if (requiredComposerPackage !== "php") {
        requireCommand = `composer require ${requiredComposerPackage} --with-all-dependencies --no-interaction --no-progress --ansi`
      }
      let requiredOutput = await asyncExec(requireCommand, asyncExecOptions)
      writeInfo("running: " + requireCommand)
      console.log(requiredOutput.stdout || requiredOutput.stderr)
    }

    for (const [requiredDevComposerPackage] of Object.entries(
      composerJson["require-dev"],
    )) {
      const requireCommand = `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`
      let requiredOutput = await asyncExec(
        `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`,
        asyncExecOptions,
      )
      writeInfo("running: " + requireCommand)
      console.log(requiredOutput.stdout || requiredOutput.stderr)
    }

    writeWarning("Don't forget to Check your Major Updates.")
    writeSuccess("Composer update completed")
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
