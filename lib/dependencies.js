const commandExists = require("command-exists");
const chalk = require("chalk");

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

module.exports = checkDependencies;
