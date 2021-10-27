#! /usr/bin/env node

const { program } = require("commander");
const create = require("./commands/create");
const setupTrellisDevelopmentFiles = require("./commands/development");
const setupSendgridAccount = require("./commands/sendgrid");
const resetConf = require("./lib/conf");

resetConf();

program
  .command("create")
  .description("Create a Lisa project")
  .option("--skip-github", "Skip setup for Git repositories")
  .action(create);

program
  .command("trellis development")
  .description("Setup Trellis files for development")
  .action(setupTrellisDevelopmentFiles);

program
  .command("sendgrid setup")
  .description("Setup Sendgrid account")
  .action(setupSendgridAccount);

program.parse();
