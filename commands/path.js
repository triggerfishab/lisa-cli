const chalk = require("chalk");
const { constants } = require("fs");
const { access } = require("fs/promises");
const conf = new (require("conf"))();
const { program } = require('commander');

program
    .command("path")
    .description("Run this command to set your global sites path")
    .argument("<path>", "Your global sites path")
    .action(path);

async function path(path) {
  try {
    await access(path, constants.R_OK | constants.W_OK);

    conf.set("sitesPath", path);
    console.log(
      chalk.greenBright(`🎉 Your path was set to ${chalk.underline(path)}.`)
    );
  } catch {
    console.log();
    console.log(
      chalk.bgRedBright.bold(
        `🚔🚔🚔 Can not access ${path}. Too bad, bye bye! 🚔🚔🚔`
      )
    );
    console.log();
  }
}

module.exports = path;
