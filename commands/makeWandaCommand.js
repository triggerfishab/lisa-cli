import { Command } from "commander"

import { askForProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import { generateSecrets } from "../lib/secrets.js"
import { writeSummary } from "../lib/summary.js"
import { isTriggerfishOfficeIp } from "../lib/triggerfish.js"
import { writeStep } from "../lib/write.js"
import { createRepos } from "../tasks/repo.js"
import setupServices from "../tasks/services/services.js"

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
    .command("generate-secrets")
    .description("Generate secrets for a Wanda project")
    .argument("[project-name]", "Name of the project")
    .action(async (projectName) => {
      if (projectName) {
        conf.set("projectName", projectName)
      }
      await generateSecrets()
    })

  wanda
    .command("setup-services")
    .description("Setup services for a Wanda project")
    .argument("[project-name]", "Name of the project")
    .action(async (projectName) => {
      if (projectName) {
        conf.set("projectName", projectName)
      }

      await isTriggerfishOfficeIp()
      await setupServices()
    })

  wanda.command("new").action(() => {
    console.log("wanda new")
  })
  return wanda
}
