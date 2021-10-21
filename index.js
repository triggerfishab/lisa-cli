#! /usr/bin/env node

const { program } = require("commander");
const create = require("./commands/create");

program
  .command("create")
  .description("Create a Lisa project")
  .option("--skip-github", "Skip setup for Git repositories")
  .action(create);

program.parse();
