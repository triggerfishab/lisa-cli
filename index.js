#!/usr/bin/env node

import chalk from "chalk"
import { Command } from "commander"
import cloneLisaProject from "./commands/clone.js"
import configure from "./commands/configure.js"
import dbImport from "./commands/db.js"
import init from "./commands/init.js"
import { createPageComponent } from "./commands/pageComponent.js"
import setupPath from "./commands/path.js"
import writeLisaStatusSummary from "./commands/status.js"
import { createCdnS3GoDaddy } from "./commands/cdnS3GoDaddy.js"
import { getKinstaHelpMessage } from "./help/kinsta.js"
import { resetConf } from "./lib/conf.js"
import { checkDependencies, checkNodeVersion } from "./lib/dependencies.js"
import exec from "./lib/exec.js"
import { getSitesPath } from "./lib/path.js"
import { set } from "./lib/store.js"
import { checkLisaVersion } from "./lib/versions.js"

export const program = new Command()

resetConf()
checkNodeVersion()

let command = process.argv[2]

async function initProgram() {
  await checkLisaVersion()
  await checkDependencies()

  const initialPath = await exec("pwd")
  set("initialPath", initialPath.stdout.trim())

  process.chdir(await getSitesPath())

  program
    .command("path")
    .description("Run this command to set your global sites path")
    .argument(
      "[path]",
      `Your global sites path, for example ${chalk.bold("~/Sites")}`
    )
    .action(setupPath)

  program
    .command("kinsta")
    .description("Output Kinsta configuration file template")
    .action(function () {
      console.log(getKinstaHelpMessage())
    })

  program
    .command("init")
    .description("Create a Lisa project")
    .requiredOption(
      "-c, --config-file <file>",
      `File with configuration options from Kinsta (relative or absolute path). Generate this file with ${chalk.bold(
        chalk.underline("lisa kinsta")
      )}`
    )
    .action(init)

  program
    .command("db import")
    .description("Import a database from staging/production environment")
    .action(dbImport)

  program
    .command("configure")
    .description("Configure all credentials for third party services")
    .option(
      "--reset",
      "Reset the config for one or all services, see argument [service] for available services."
    )
    .argument(
      "[service]",
      "Pass an argument for which service to configure, available services: aws, godaddy, sendgrid"
    )
    .action(configure)

  program
    .command("clone")
    .description("Clone an existing Lisa project for local development")
    .action(cloneLisaProject)

  program
    .command("status")
    .description("Show a status summary of your Lisa site.")
    .action(writeLisaStatusSummary)

  program
    .command("page-component create")
    .description("Create a new page component for your frontend app")
    .action(createPageComponent)

  program.command("pcc", { hidden: true }).action(createPageComponent)

  program
    .command("cdn create")
    .description("Create S3 bucket and CloudFront distribution. Also create CNAME recrods in GoDaddy DNS.")
    .action(createCdnS3GoDaddy)

  program.parse()
}

initProgram()
