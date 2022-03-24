#! /usr/bin/env node

const { program } = require("commander");
const util = require("util");

const { getKinstaHelpMessage } = require("./help/kinsta");
const resetConf = require("./lib/conf");
const { validateCurrentPath } = require("./lib/path");
const { generateSecrets } = require("./lib/secrets");
const checkDependencies = require("./lib/dependencies");

const {
  cloneLisaProject,
  configureTrellisForKinsta,
  dbImport,
  destroy,
  init,
  path,
  setup,
  setupLocalSiteForDevelopment,
  setupSendgridAccount,
  setupS3Bucket,
} = require("./commands");

resetConf();

let command = process.argv[2];

async function initProgram() {
  await validateCurrentPath(command);
  await checkDependencies();

  program
    .command("init")
    .description("Create a Lisa project")
    .option("--skip-github", "Skip setup for Git repositories")
    .action(init);

  program
    .command("setup")
    .description("Setup all credentials for third party services")
    .argument(
      "[service]",
      "Pass an argument for which service to setup, available services: s3"
    )
    .action(setup);

  program
    .command("local")
    .description("Setup Lisa site for local development")
    .action(setupLocalSiteForDevelopment);

  program
    .command("sendgrid setup")
    .description("Setup Sendgrid account")
    .action(setupSendgridAccount);

  program
    .command("kinsta")
    .description("Setup Kinsta configuration files in Trellis project")
    .option(
      "--config-file <file>",
      "File with configuration options from Kinsta"
    )
    .addHelpText("after", getKinstaHelpMessage())
    .action(configureTrellisForKinsta);

  program
    .command("clone")
    .description("Clone an existing Lisa project for local development")
    .action(cloneLisaProject);

  program
    .command("db import")
    .description("Import a database from staging/production environment")
    .action(dbImport);

  program
    .command("path")
    .description("Run this command to set your global sites path")
    .argument("<path>", "Your global sites path")
    .action(path);

  program
    .command("secrets")
    .description("Generate secrets")
    .action(generateSecrets);

  program
    .command("destroy")
    .description("Destroy a local Lisa site")
    .action(destroy);

  program.command("s3").description("Setup S3 bucket").action(setupS3Bucket);

  program.parse();
}

initProgram();
