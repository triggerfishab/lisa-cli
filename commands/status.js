import chalk from "chalk"
import semver from "semver"
import asyncExec from "../lib/exec.js"
import { versions } from "../lib/versions.js"
import { writeInfo, writeStep } from "../lib/write.js"

export default async function writeLisaStatusSummary() {
  writeStep("A summary of your Lisa setup")

  let lisaPath = await asyncExec("lisa path")

  console.log(lisaPath.stdout.trim())
  writeInfo("Versions of your packages:")

  let summary = []

  let ansibleVersion = await asyncExec("ansible --version")
  ansibleVersion = ansibleVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   Ansible: ${
      semver.compare(ansibleVersion[1], versions.ansibleVault) === -1
        ? chalk.red(
            `${ansibleVersion[1]} <-- Please upgrade to ${versions.ansibleVault} or higher`
          )
        : chalk.green(ansibleVersion[1])
    }`
  )

  let awsVersion = await asyncExec("aws --version")
  awsVersion = awsVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   AWS CLI: ${
      semver.compare(awsVersion[1], versions.aws) === -1
        ? chalk.red(
            `${awsVersion[1]} <-- Please upgrade to ${versions.aws} or higher`
          )
        : chalk.green(awsVersion[1])
    }`
  )

  let ghVersion = await asyncExec("gh --version")
  ghVersion = ghVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   GitHub CLI: ${
      semver.compare(ghVersion[1], versions.gh) === -1
        ? chalk.red(
            `${ghVersion[1]} <-- Please upgrade to ${versions.gh} or higher`
          )
        : chalk.green(ghVersion[1])
    }`
  )

  let nodeVersion = await asyncExec("node --version")
  nodeVersion = nodeVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   Node: ${
      semver.compare(nodeVersion[1], versions.node) === -1
        ? chalk.red(
            `${nodeVersion[1]} <-- Please upgrade to ${versions.node} or higher`
          )
        : chalk.green(nodeVersion[1])
    }`
  )

  let trellisVersion = await asyncExec("trellis --version")
  trellisVersion = trellisVersion.stderr.match(/([0-9.]+)/)
  summary.push(
    `   Trellis CLI: ${
      semver.compare(trellisVersion[1], versions.trellisCli) === -1
        ? chalk.red(
            `${trellisVersion[1]} <-- Please upgrade to ${versions.trellisCli} or higher`
          )
        : chalk.green(trellisVersion[1])
    }`
  )

  let valetVersion = await asyncExec("valet --version")
  valetVersion = valetVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   Valet: ${
      semver.compare(valetVersion[1], versions.valet) === -1
        ? chalk.red(
            `${valetVersion[1]} <-- Please upgrade to ${versions.valet} or higher`
          )
        : chalk.green(valetVersion[1])
    }`
  )

  let vercelVersion = await asyncExec("vercel --version")
  vercelVersion = vercelVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   Vercel: ${
      semver.compare(vercelVersion[1], versions.vercel) === -1
        ? chalk.red(
            `${vercelVersion[1]} <-- Please upgrade to ${versions.vercel} or higher`
          )
        : chalk.green(vercelVersion[1])
    }`
  )

  let wpCliVersion = await asyncExec("wp --version")
  wpCliVersion = wpCliVersion.stdout.match(/([0-9.]+)/)
  summary.push(
    `   WP CLI: ${
      semver.compare(wpCliVersion[1], versions.wpCli) === -1
        ? chalk.red(
            `${wpCliVersion[1]} <-- Please upgrade to ${versions.wpCli} or higher`
          )
        : chalk.green(wpCliVersion[1])
    }`
  )

  summary.map((row) => console.log(row))
}
