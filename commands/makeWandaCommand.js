import { Command } from "commander"

import { askForProjectName } from "../lib/app-name.js"
import { writeSummary } from "../lib/summary.js"
import { isTriggerfishOfficeIp } from "../lib/triggerfish.js"
import { writeStep } from "../lib/write.js"
import { createRepos } from "../tasks/repo.js"

export async function makeWandaCommand() {
  const wanda = new Command("wanda").description(
    "Wanda is a command to help you handle Radicle projects.",
  )

  wanda
    .command("init")
    .description("Initialize a new Wanda project")
    .argument("[project-name]", "Name of the project")
    .action(async (projectName) => {
      console.log("projectName", projectName)
      writeStep("Creating new Wanda project!")
      await isTriggerfishOfficeIp()
      await askForProjectName("", projectName)
      await createRepos("wanda")
      // await setupLocalSiteForDevelopment()
      // await configureTrellisForKinsta(configFile || "")
      // await generateSecrets()
      // await setupServices()
      // await addCredentialsTo1Password()
      await writeSummary()
    })
  wanda
    .command("generate secrets")
    .description("Generate secrets for a Wanda project")
    .argument("[project-name]", "Name of the project")
    .action(async (projectName) => {
      await isTriggerfishOfficeIp()
      await generateSecrets(projectName)
    })

  wanda.command("new").action(() => {
    console.log("wanda new")
  })
  return wanda
}
