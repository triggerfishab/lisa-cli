import asyncExec from "../lib/exec.js"
import { writeInfo, writeStep } from "../lib/write.js"

export default async function writeLisaStatusSummary() {
  writeStep("A summary of your Lisa setup")

  let lisaPath = await asyncExec("lisa path")

  writeInfo(`Lisa path: ${lisaPath.stdout.trim()}`)
  writeInfo("Versions of your packages:")

  let summary = []

  let ansibleVersion = await asyncExec("ansible --version")
  ansibleVersion = ansibleVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   Ansible: ${ansibleVersion[1]}`)

  let awsVersion = await asyncExec("aws --version")
  awsVersion = awsVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   AWS CLI: ${awsVersion[1]}`)

  let ghVersion = await asyncExec("gh --version")
  ghVersion = ghVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   GitHub CLI: ${ghVersion[1]}`)

  let nodeVersion = await asyncExec("node --version")
  nodeVersion = nodeVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   Node: ${nodeVersion[1]}`)

  let trellisVersion = await asyncExec("trellis --version")
  trellisVersion = trellisVersion.stderr.match(/([0-9.]+)/)
  summary.push(`   Trellis CLI: ${trellisVersion[1]}`)

  let valetVersion = await asyncExec("valet --version")
  valetVersion = valetVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   Valet: ${valetVersion[1]}`)

  let vercelVersion = await asyncExec("vercel --version")
  vercelVersion = vercelVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   Vercel: ${vercelVersion[1]}`)

  let wpCliVersion = await asyncExec("wp --version")
  wpCliVersion = wpCliVersion.stdout.match(/([0-9.]+)/)
  summary.push(`   WP CLI: ${wpCliVersion[1]}`)

  summary.map((row) => console.log(row))
}
