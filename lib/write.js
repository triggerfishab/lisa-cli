const chalk = require("chalk");

function writeInfo(message) {
  console.log(`ℹ️ ${message}`);
}

function writeWarning(message) {
  console.log(`⚠️ ${chalk.yellow(message)}`);
}

function writeError(message) {
  console.log(`🆘 ${chalk.red(message)}`);
}

function writeSuccess(message) {
  console.log(`🎉 ${chalk.green(message)}`);
}

function writeStep(message) {
  console.log();
  console.log(`⚡️ ${chalk.green.bold(message)}`);
  console.log();
}

function writeEmptyLine() {
  console.log();
}

module.exports = {
  writeInfo,
  writeWarning,
  writeSuccess,
  writeError,
  writeEmptyLine,
  writeStep,
};
