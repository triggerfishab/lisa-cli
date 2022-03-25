const commandExists = require("command-exists");
const { writeError } = require("./write");

async function checkDependencies() {
  let missingDependencies = [];

  try {
    await commandExists("aws");
  } catch {
    missingDependencies.push("aws");
  }

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
    writeError(`Missing dependencies: ${missingDependencies.join(", ")}`);
    writeError("Please install the dependencies above and try again.");
    writeError(
      "Look at https://github.com/triggerfishab/lisa-cli/blob/master/README.md for more info on the dependencies."
    );

    process.exit();
  }
}

module.exports = checkDependencies;
