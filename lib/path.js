const chalk = require("chalk");
const exec = require("../lib/exec");
const conf = new (require("conf"))();

async function validateCurrentPath(command) {
  if (command !== "path") {
    let sitesPath = getSitesPath();
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
}

function getSitesPath() {
  let sitesPath = conf.get("sitesPath");

  if (!sitesPath) {
    console.log();
    console.log(
      chalk.bgRedBright.bold(
        `🚔🚔🚔 No site path was found, please run ${chalk.underline(
          "lisa path"
        )} to set one! 🚔🚔🚔`
      )
    );
    console.log();

    process.exit();
  }

  return sitesPath;
}

module.exports = { getSitesPath, validateCurrentPath };
