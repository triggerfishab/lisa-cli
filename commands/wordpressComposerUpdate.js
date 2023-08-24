import asyncExec from "../lib/exec.js"
import fs from "fs"
import { writeError } from "../lib/write.js"
import { versions } from "../lib/versions.js"
import semver from "semver"

export async function wpUpdate() {
  const asyncExecOptions = {
    stdio: "inherit",
    cwd: process.env.PWD,
  }

  //  TODO: list major vesionsas as output at the end
  //  TODO: add done yay message
  //  TODO: add description to program
  // TODO: loop through every packaage change
  // TODO:  update dev dependencies
  // TODO: * bonus check configured repositories for correct kinsta
  // TODO: * bonus check configured repositories for correct triggerfish composer
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

    let requiredComposerPackages = ""
    for (const [requiredComposerPackage] of Object.entries(
      composerJson.require,
    )) {
      if (requiredComposerPackage === "php") {
        requiredComposerPackages += `"${requiredComposerPackage}:${phpVersion}" `
      }
      if (requiredComposerPackage !== "php") {
        requiredComposerPackages += `${requiredComposerPackage} `
      }
    }

    const composerRequireOutput = await asyncExec(
      `composer require ${requiredComposerPackages} --with-all-dependencies --no-interaction --no-progress --ansi`,
      asyncExecOptions,
    )
    console.log(composerRequireOutput.stderr.trim())
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
