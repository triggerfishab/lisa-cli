#! /usr/bin/env node

const { program } = require("commander");

const resetConf = require("./lib/conf");
const { validateCurrentPath } = require("./lib/path");
const { generateSecrets } = require("./lib/secrets");
const checkDependencies = require("./lib/dependencies");

resetConf();

let command = process.argv[2];

async function initProgram() {
  await validateCurrentPath(command);
  await checkDependencies();

  var normalizedPath = require("path").join(__dirname, "commands");

  require("fs")
    .readdirSync(normalizedPath)
    .forEach(function (file) {
      require("./commands/" + file);
    });

  program
    .command("secrets")
    .description("Generate secrets")
    .action(generateSecrets);

  program.parse();
}

initProgram();
