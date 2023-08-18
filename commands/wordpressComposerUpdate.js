#!/usr/bin/env node

const { Command } = require("commander")
const { execSync } = require("child_process")
const fs = require("fs")

const program = new Command()

program.description("A script to check and modify composer.json").action(() => {
  try {
    if (!isCommandAvailable("jq")) {
      console.log("jq is not installed. Attempting to install...")
      if (isCommandAvailable("brew")) {
        execSync("brew install jq")
      } else {
        console.error(
          "Error: Homebrew is not installed. Install Homebrew and try again.",
        )
        process.exit(1)
      }
    }

    if (!isCommandAvailable("composer")) {
      console.error("Error: composer is not installed.")
      process.exit(1)
    }

    try {
      execSync("composer validate --no-check-all --strict", {
        stdio: "inherit",
      })
    } catch {
      console.error("Error: composer.json is not valid.")
      process.exit(1)
    }

    const composerJson = JSON.parse(fs.readFileSync("composer.json", "utf8"))
    if (composerJson.require.php !== ">=8.1") {
      composerJson.require.php = ">=8.1"
      fs.writeFileSync("composer.json", JSON.stringify(composerJson, null, 2))
    }

    for (const pluginName in composerJson.require) {
      if (pluginName !== "php") {
        execSync(`composer require ${pluginName}`)
      }
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

program.parse(process.argv)

function isCommandAvailable(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}
