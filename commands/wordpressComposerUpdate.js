import asyncExec from "../lib/exec.js"
import fs from "fs"
import { writeError, writeInfo, writeSuccess, writeWarning } from "../lib/write.js"
import { versions } from "../lib/versions.js"
import semver from "semver"

export async function wpUpdate() {
  const asyncExecOptions = {
    stdio: "inherit",
    cwd: process.env.PWD,
  }

  //  TODO: list composer major package version updates as output at the end
  // TODO:  update dev dependencies
  // TODO: * bonus check configured repositories for correct kinsta
  // TODO: * bonus check configured repositories for correct triggerfish
  // TODO: * bonus check if --format=json is available in all commands (required´)
  //   "repositories": {
  //     "0": {
  //       "type": "composer",
  //       "url": "https://wpackagist.org",
  //       "only": [
  //         "wpackagist-plugin/*",
  //         "wpackagist-theme/*"
  //       ]
  //     },
  //     "composer.triggerfish.cloud": {
  //       "type": "composer",
  //       "url": "https://composer.triggerfish.cloud/",
  //       "only": [
  //         "triggerfish/*",
  //         "rocketgenius/gravity-forms",
  //         "wpengine/advanced-custom-fields-pro"
  //       ]
  //     }
  //   },

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
      let requireCommand = ''
      if (requiredComposerPackage === "php") {
        requireCommand = `composer require "${requiredComposerPackage}:${phpVersion}" --with-all-dependencies --no-interaction  --ansi`
      }
      if (requiredComposerPackage !== "php") {
        requireCommand = `composer require ${requiredComposerPackage} --with-all-dependencies --no-interaction --no-progress --ansi`
      }
      let requiredOutput = await asyncExec(requireCommand, asyncExecOptions)
      writeInfo('running: ' + requireCommand)
      console.log(requiredOutput.stdout || requiredOutput.stderr)
    }

    writeWarning("Don't forget to Check your Major Updates.")
    writeSuccess("Composer update completed")
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
