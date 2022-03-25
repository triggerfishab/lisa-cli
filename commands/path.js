const chalk = require("chalk");
const { constants } = require("fs");
const { access } = require("fs/promises");
const conf = require("../lib/conf");
const { program } = require("commander");
const { writeSuccess, writeError } = require("../lib/write");

program
  .command("path")
  .description("Run this command to set your global sites path")
  .argument("<path>", "Your global sites path")
  .action(path);

async function path(path) {
  try {
    await access(path, constants.R_OK | constants.W_OK);

    conf.set("sitesPath", path);
    writeSuccess(`Your path was set to ${chalk.underline(path)}.`);
  } catch {
    writeError(`Can not access ${path}. Too bad, bye bye!`);
  }
}

module.exports = path;
