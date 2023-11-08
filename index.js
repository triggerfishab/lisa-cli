#!/usr/bin/env node
import chalk from "chalk"
import { Command } from "commander"

import {
  createCdnS3GoDaddy,
  updateBucketAccessPolicyAndCreateIAMUser,
  updateBucketLicecyclePolicy,
} from "./commands/cdnS3GoDaddy.js"
import cloneLisaProject from "./commands/clone.js"
import configure from "./commands/configure.js"
import dbImport from "./commands/db.js"
import { createGoDaddy } from "./commands/godaddy.js"
import init from "./commands/init.js"
import { kinsta } from "./commands/kinsta.js"
import { createPageComponent } from "./commands/pageComponent.js"
import setupPath from "./commands/path.js"
import { createSendGrid } from "./commands/sendgrid.js"
import writeLisaStatusSummary from "./commands/status.js"
import { wpUpdate } from "./commands/wordpressComposerUpdate.js"
import { resetConf } from "./lib/conf.js"
import { checkDependencies, checkNodeVersion } from "./lib/dependencies.js"
import exec from "./lib/exec.js"
import { getSitesPath } from "./lib/path.js"
import { set } from "./lib/store.js"
import { checkLisaVersion } from "./lib/versions.js"

export const program = new Command()
export const LISA_VERSION = "2.15.7"

resetConf()
checkNodeVersion()

const command = process.argv[2]

async function initProgram() {
  await checkLisaVersion()
  await checkDependencies()

  const initialPath = await exec("pwd")
  set("initialPath", initialPath.stdout.trim())

  process.chdir(await getSitesPath())

  program.version(LISA_VERSION, "-v, --version", "Output the current version")

  program
    .command("path")
    .description("Run this command to set your global sites path")
    .argument(
      "[path]",
      `Your global sites path, for example ${chalk.bold("~/Sites")}`,
    )
    .action(setupPath)

  program
    .command("kinsta")
    .description("Output Kinsta configuration file template")
    .argument(
      "<action>",
      "Pass an argument for which action to perform, available actions: show-config, create",
    )
    .action(kinsta)

  program
    .command("init")
    .description("Create a Lisa project")
    .requiredOption(
      "-c, --config-file <file>",
      `File with configuration options from Kinsta (relative or absolute path). Generate this file with ${chalk.bold(
        chalk.underline("lisa kinsta"),
      )}`,
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
      "Reset the config for one or all services, see argument [service] for available services.",
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
    .description(
      "Create S3 bucket and CloudFront distribution. Also create CNAME recrods in GoDaddy DNS.",
    )
    .action(createCdnS3GoDaddy)

  program
    .command("sendgrid create")
    .description("Create SendGrid account")
    .action(createSendGrid)

  program
    .command("wp update")
    .description(
      `Update WordPress and Composer dependencies.
Make sure your standing in the folder where your composer.json file is located.
    `,
    )
    .action(wpUpdate)

  program
    .command("godaddy create")
    .description("Create DNS-records in GoDaddy")
    .action(createGoDaddy)

  program
    .command("aws user create")
    .description("Update Bucket Access Policy and create IAM user in AWS")
    .action(updateBucketAccessPolicyAndCreateIAMUser)

  program
    .command("s3 bucket set-lifecycle-policy")
    .description("Update Bucket Lifecycle Policy in S3")
    .action(updateBucketLicecyclePolicy)

  program.parse()
}

initProgram()
