import chalk from "chalk"
import semver from "semver"

import { LISA_VERSION } from "../index.js"
import asyncExec from "../lib/exec.js"
import { versions } from "../lib/versions.js"
import { writeInfo, writeStep } from "../lib/write.js"

export default async function writeLisaStatusSummary() {
  writeStep("A summary of your Lisa setup")

  let lisaPath = await asyncExec("lisa path")

  console.log(lisaPath.stdout.trim())
  writeInfo("Versions of your packages:")

  let summary = []

  summary.push(`   Lisa CLI: ${chalk.green(LISA_VERSION)}`)

  const packages = [
    {
      packageName: "1Password CLI",
      versionCommand: "op --version",
      minVersion: versions.op,
    },
    {
      packageName: "Ansible",
      versionCommand: "ansible --version",
      minVersion: versions.ansibleVault,
    },
    {
      packageName: "AWS CLI",
      versionCommand: "aws --version",
      minVersion: versions.aws,
    },
    {
      packageName: "GitHub CLI",
      versionCommand: "gh --version",
      minVersion: versions.gh,
    },

    {
      packageName: "Node",
      versionCommand: "node --version",
      minVersion: versions.node,
    },
    {
      packageName: "Trellis CLI",
      versionCommand: "trellis --version",
      minVersion: versions.trellisCli,
    },
    {
      packageName: "Valet",
      versionCommand: "valet --version",
      minVersion: versions.valet,
    },
    {
      packageName: "Vercel",
      versionCommand: "vercel --version",
      minVersion: versions.vercel,
    },
    {
      packageName: "WP CLI",
      versionCommand: "wp --version",
      minVersion: versions.wpCli,
    },
    {
      packageName: "Composer",
      versionCommand: "composer --version",
      minVersion: versions.composer,
    },
    {
      packageName: "PHP",
      versionCommand: "php -r 'echo PHP_VERSION;'",
      minVersion: versions.php,
    },
  ]

  for (const packageItem of packages) {
    let packageItemVersion = await asyncExec(packageItem.versionCommand)
    packageItemVersion = packageItemVersion.stdout || packageItemVersion.stderr
    packageItemVersion = packageItemVersion.match(/([0-9.]+)/)
    packageItemVersion = packageItemVersion[1]
    summary.push(
      `   ${packageItem.packageName}: ${
        semver.compare(packageItemVersion, packageItem.minVersion) === -1
          ? chalk.red(
              `${packageItemVersion} <-- Please upgrade to ${packageItem.minVersion} or higher`,
            )
          : chalk.green(packageItemVersion)
      }`,
    )
  }

  summary.map((row) => console.log(row))
}
