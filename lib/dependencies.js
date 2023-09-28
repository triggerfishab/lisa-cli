import commandExists from "command-exists"

import { writeError } from "./write.js"

export async function checkDependencies() {
  let missingDependencies = []
  let command = process.argv[2]

  if (command === "cdn") {
    try {
      await commandExists("op")
    } catch {
      missingDependencies.push("1password-cli")
    }
  }

  if (command === "wp") {
    try {
      await commandExists("composer")
    } catch {
      missingDependencies.push("composer")
    }

    try {
      await commandExists("php")
    } catch {
      missingDependencies.push("php")
    }
  }

  if (command === "init" || command === "clone") {
    try {
      await commandExists("aws")
    } catch {
      missingDependencies.push("aws")
    }

    try {
      await commandExists("ansible")
    } catch {
      missingDependencies.push("ansible-vault")
    }

    try {
      await commandExists("gh")
    } catch {
      missingDependencies.push("gh")
    }

    try {
      await commandExists("trellis")
    } catch {
      missingDependencies.push("trellis-cli")
    }

    try {
      await commandExists("valet")
    } catch {
      missingDependencies.push("valet")
    }

    try {
      await commandExists("vercel")
    } catch {
      missingDependencies.push("vercel")
    }

    try {
      await commandExists("wp")
    } catch {
      missingDependencies.push("wp-cli")
    }

    try {
      await commandExists("op")
    } catch {
      missingDependencies.push("1password-cli")
    }

    try {
      await commandExists("composer")
    } catch {
      missingDependencies.push("composer")
    }

    try {
      await commandExists("php")
    } catch {
      missingDependencies.push("php")
    }
  }

  if (missingDependencies.length) {
    writeError(`Missing dependencies: ${missingDependencies.join(", ")}`)
    writeError("Please install the dependencies above and try again.")
    writeError(
      "Look at https://github.com/triggerfishab/lisa-cli/blob/master/README.md for more info on the dependencies.",
    )

    process.exit()
  }
}

export function checkNodeVersion() {
  let nodeVersion = process.version.match(/^v(\d+)/)[1]

  if (nodeVersion < 12) {
    writeError(
      `You are running node version ${nodeVersion}. Please update to latest Node version.`,
    )
    process.exit()
  }
}
