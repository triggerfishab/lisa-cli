const chalk = require("chalk");

const conf = new (require("conf"))();

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

module.exports = { getSitesPath };
