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

/**
 * @param {object} composerJson
 * @param {string} minimumStability
 * @returns {void}
 */
function setMinimumStability(composerJson, minimumStability) {
  if (composerJson["minimum-stability"] !== minimumStability) {
    const updatedComposerJson = composerJson
    updatedComposerJson["minimum-stability"] = minimumStability
    fs.writeFileSync(
      `${process.env.PWD}/composer.json`,
      JSON.stringify(updatedComposerJson, null, 2),
    )
  }
}

/**
 * @param {object} composerJson
 * @param {boolean} preferStable
 * @returns {void}
 */
function setPreferredStability(composerJson, preferStable) {
  if (composerJson["prefer-stable"] !== preferStable) {
    const updatedComposerJson = composerJson
    updatedComposerJson["prefer-stable"] = preferStable
    fs.writeFileSync(
      `${process.env.PWD}/composer.json`,
      JSON.stringify(updatedComposerJson, null, 2),
    )
  }
}

/**
 * @param {object} composerJson
 * @param {string} phpVersion
 * @param {object} asyncExecOptions
 * @param {string} asyncExecOptions.stdio
 * @param {string} asyncExecOptions.cwd
 * @returns {Promise<void>}
 */
async function updateRequirePackages(
  composerJson,
  phpVersion,
  asyncExecOptions,
) {
  for (const requiredComposerPackage of Object.keys(
    composerJson.require,
  )) {
    let requireCommand = ""
    if (requiredComposerPackage.startsWith("ext-")) {
      continue
    }
    if (requiredComposerPackage === "php") {
      requireCommand = `composer require "${requiredComposerPackage}:${phpVersion}" --with-all-dependencies --no-interaction  --ansi`
    }
    if (requiredComposerPackage !== "php") {
      requireCommand = `composer require ${requiredComposerPackage} --with-all-dependencies --no-interaction --no-progress --ansi`
    }
    const requiredOutput = await asyncExec(requireCommand, asyncExecOptions)
    writeInfo(`running: ${requireCommand}`)
    console.log(requiredOutput.stdout || requiredOutput.stderr)
  }
}

/**
 * @param {object} composerJson
 * @param {object} asyncExecOptions
 * @param {string} asyncExecOptions.stdio
 * @param {string} asyncExecOptions.cwd
 * @returns {Promise<void>}
 */
async function updateRequireDevPackages(composerJson, asyncExecOptions) {
  for (const requiredDevComposerPackage of Object.keys(
    composerJson["require-dev"],
  )) {
    const requireCommand = `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`
    const requiredOutput = await asyncExec(
      `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`,
      asyncExecOptions,
    )
    writeInfo(`running: ${requireCommand}`)
    console.log(requiredOutput.stdout || requiredOutput.stderr)
  }
}

/**
 * @param {object} asyncExecOptions
 * @param {string} asyncExecOptions.stdio
 * @param {string} asyncExecOptions.cwd
 * @return {Promise<void>}
 */
async function validateComposerFile(asyncExecOptions) {
  const composerValidateOutput = await asyncExec(
    "composer validate --no-check-all --strict --no-interaction --ansi",
    asyncExecOptions,
  )
  console.log(composerValidateOutput.stdout)
}

/**
 * @returns {object}
 */
function getComposerJson() {
  return JSON.parse(fs.readFileSync(`${process.env.PWD}/composer.json`, "utf8"))
}

/**
 * @returns {Promise<void>}
 */
export default async function wpUpdate() {
  const asyncExecOptions = {
    stdio: "inherit",
    cwd: process.env.PWD,
  }

  const parsedPhpVersion = semver.parse(versions.php, {})
  const phpVersion = `>=${parsedPhpVersion.major}.${parsedPhpVersion.minor}`
  const minimumStability = "dev"
  const preferStable = true

  try {
    await validateComposerFile(asyncExecOptions)
    const composerJson = getComposerJson()
    setMinimumStability(composerJson, minimumStability)
    setPreferredStability(composerJson, preferStable)
    await updateRequirePackages(composerJson, phpVersion, asyncExecOptions)
    await updateRequireDevPackages(composerJson, asyncExecOptions)

    writeWarning("Don't forget to Check your Major Updates.")
    writeSuccess("Composer update completed")
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
