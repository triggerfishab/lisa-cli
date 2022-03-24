#! /usr/bin/env node

const { program } = require("commander");
const init = require("./commands/init");
const configureTrellisForKinsta = require("./commands/kinsta");
const setupSendgridAccount = require("./commands/sendgrid");
const { getKinstaHelpMessage } = require("./help/kinsta");
const resetConf = require("./lib/conf");
const setupLocalSiteForDevelopment = require("./commands/local");
const cloneLisaProject = require("./commands/clone");
const path = require("./commands/path");
const dbImport = require("./commands/db");
const destroy = require("./commands/destroy");
const setup = require("./commands/setup");
const { getSitesPath } = require("./lib/path");
const util = require("util");
const chalk = require("chalk");
const { generateSecrets } = require("./lib/secrets");
const exec = util.promisify(require("child_process").exec);
const commandExists = require("command-exists");
const setupS3Bucket = require("./commands/s3");

resetConf();

let command = process.argv[2];

async function initProgram() {
  if (command !== "path") {
    let sitesPath = await getSitesPath();
    let pwd = await exec(`pwd`);

    if (sitesPath !== pwd.stdout.trim()) {
      console.log();
      console.log(
        chalk.bgRedBright.bold(
          `🚔🚔🚔 You are in the wrong directory, please run ${chalk.underline(
            `cd ${sitesPath}`
          )} and try again! 🚔🚔🚔`
        )
      );
      process.exit();
    }
  }

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

async function checkDependencies() {
  let missingDependencies = [];

  try {
    await commandExists("ansible");
  } catch {
    missingDependencies.push("ansible-vault");
  }

  try {
    await commandExists("gh");
  } catch {
    missingDependencies.push("gh");
  }

  try {
    await commandExists("trellis");
  } catch {
    missingDependencies.push("trellis-cli");
  }

  try {
    await commandExists("valet");
  } catch {
    missingDependencies.push("valet");
  }

  try {
    await commandExists("vercel");
  } catch {
    missingDependencies.push("vercel");
  }

  try {
    await commandExists("wp");
  } catch {
    missingDependencies.push("wp-cli");
  }

  if (missingDependencies.length) {
    console.log();
    console.log(
      chalk.redBright.bold(
        `Missing dependencies: ${missingDependencies.join(", ")}`
      )
    );
    console.log(
      chalk.redBright.bold(
        "🚨 Please install the dependencies above and try again."
      )
    );
    console.log(
      chalk.redBright.bold(
        "🚨 Look at https://github.com/triggerfishab/lisa-cli/blob/master/README.md for more info on the dependencies."
      )
    );

    process.exit();
  }
}

initProgram();
