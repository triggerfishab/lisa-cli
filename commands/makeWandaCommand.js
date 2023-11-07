import { Command } from "commander"

import { askForProjectName } from "../lib/app-name.js"
import { isTriggerfishOfficeIp } from "../lib/triggerfish.js"
import { writeStep } from "../lib/write.js"

export async function makeWandaCommand() {
  const wanda = new Command("wanda")
  wanda
    .version("0.0.1")
    .description("Wanda is a tool to help you create a new Radicle project.")
    .option("-c, --config-file <file>", "Path to Kinsta config file")
    .helpOption("-h, --help", "Display help for command")
    .alias("w")

  wanda.command("init").action(async () => {
    writeStep("Creating new Wanda project!")
    await isTriggerfishOfficeIp()
    await askForProjectName()
    // await createRepos()
    // await setupLocalSiteForDevelopment()
    // await configureTrellisForKinsta(configFile || "")
    // await addSiteToVercel()
    // await configureNextConfig()
    // await generateSecrets()
    // await setupServices()
    // await addCredentialsTo1Password()
    await writeSummary()
  })
  const wandaNewCommand = new Command("new")

  wanda.addCommand(wandaNewCommand).action(() => {
    console.log("wanda pot")
  })
  return wanda
}
