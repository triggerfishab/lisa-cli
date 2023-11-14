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
 * @param {string} minimumStability
 * @returns {void}
 */
function setMinimumStability(minimumStability) {
  const composerJson = getComposerJson()

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
 * @param {boolean} preferStable
 * @returns {void}
 */
function setPreferredStability(preferStable) {
  const composerJson = getComposerJson()

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
 * @param {string} phpVersion
 * @returns {Promise<void>}
 */
async function updateRequirePackages(phpVersion) {
  const composerJson = getComposerJson()

  for (const requiredComposerPackage of Object.keys(composerJson.require)) {
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
    const requiredOutput = await asyncExec(
      requireCommand,
      getAsyncExecOptionsForPWD(),
    )
    writeInfo(`running: ${requireCommand}`)
    console.log(requiredOutput.stdout || requiredOutput.stderr)
  }
}

/**
 * @returns {Promise<void>}
 */
async function updateRequireDevPackages() {
  const composerJson = getComposerJson()

  for (const requiredDevComposerPackage of Object.keys(
    composerJson["require-dev"],
  )) {
    const requireCommand = `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`
    const requiredOutput = await asyncExec(
      `composer require ${requiredDevComposerPackage} --dev --with-all-dependencies --no-interaction --no-progress --ansi`,
      getAsyncExecOptionsForPWD(),
    )
    writeInfo(`running: ${requireCommand}`)
    console.log(requiredOutput.stdout || requiredOutput.stderr)
  }
}

/**
 * @return {Promise<void>}
 */
async function validateComposerFile() {
  const composerValidateOutput = await asyncExec(
    "composer validate --no-check-all --strict --no-interaction --ansi",
    getAsyncExecOptionsForPWD(),
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
 * @return {{cwd: string, stdio: string}}
 */
function getAsyncExecOptionsForPWD() {
  return {
    stdio: "inherit",
    cwd: process.env.PWD,
  }
}

/**
 * @returns {Promise<void>}
 */
export default async function wpUpdate() {
  const parsedPhpVersion = semver.parse(versions.php, {})
  const phpVersion = `>=${parsedPhpVersion.major}.${parsedPhpVersion.minor}`
  const minimumStability = "dev"
  const preferStable = true

  try {
    await validateComposerFile()
    setMinimumStability(minimumStability)
    setPreferredStability(preferStable)
    await updateRequirePackages(phpVersion)
    await updateRequireDevPackages()

    writeWarning("Don't forget to Check your Major Updates.")
    writeSuccess("Composer update completed")
  } catch (err) {
    writeError(err)
    process.exit(1)
  }
}
