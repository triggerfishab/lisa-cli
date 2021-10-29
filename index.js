#! /usr/bin/env node

const { program } = require("commander");
const init = require("./commands/init");
const setupTrellisDevelopmentFiles = require("./commands/local");
const configureTrellisForKinsta = require("./commands/kinsta");
const setupSendgridAccount = require("./commands/sendgrid");
const { getKinstaHelpMessage } = require("./help/kinsta");
const resetConf = require("./lib/conf");
const setupLocalSiteForDevelopment = require("./commands/local");

resetConf();

program
  .command("init")
  .description("Create a Lisa project")
  .option("--skip-github", "Skip setup for Git repositories")
  .action(init);

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
  .option("--config-file <file>", "File with configuration options from Kinsta")
  .addHelpText("after", getKinstaHelpMessage())
  .action(configureTrellisForKinsta);

program.parse();
