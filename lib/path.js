const chalk = require("chalk");
const exec = require("../lib/exec");
const { writeError } = require("./write");
const conf = require("./conf");

async function validateCurrentPath(command) {
  if (command !== "path") {
    let sitesPath = getSitesPath();
    let pwd = await exec(`pwd`);

    if (sitesPath !== pwd.stdout.trim()) {
      writeError(
        `You are in the wrong directory, please run ${chalk.bold(
          chalk.underline(`cd ${sitesPath}`)
        )} and try again!`
      );
      process.exit();
    }
  }
}

function getSitesPath() {
  let sitesPath = conf.get("sitesPath");

  if (!sitesPath) {
    writeError(
      `No site path was found, please run ${chalk.bold(
        chalk.underline("lisa path")
      )} to set one!`
    );

    process.exit();
  }

  return sitesPath;
}

module.exports = { getSitesPath, validateCurrentPath };
