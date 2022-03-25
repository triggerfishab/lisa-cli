const {
  askForProjectName,
  getApiName,
  getAppName,
} = require("../lib/app-name");
const exec = require("../lib/exec");
const chalk = require("chalk");
const prompts = require("prompts");
const { program } = require("commander");
const { writeSuccess, writeError, writeInfo } = require("../lib/write");

program
  .command("destroy")
  .description("Destroy a local Lisa site")
  .action(destroy);

async function destroy() {
  await askForProjectName();

  let appName = await getAppName();
  let apiName = await getApiName();

  let databaseName = await exec("wp config get DB_NAME", {
    cwd: `${apiName}/site`,
  });

  writeInfo(`
  ${chalk.bold("The following will be removed:")}
  ${apiName} local site
  ${appName} directory
  ${apiName} directory
  ${databaseName.stdout.trim()} database`);

  let { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: "Are you sure you want to proceed?",
  });

  if (!confirm) {
    writeError("No changes made, kthxbye!");
    process.exit();
  }

  await exec("wp db drop --yes", { cwd: `${apiName}/site` });
  writeSuccess(" Local database ${apiName} removed.");

  await exec(`valet unlink ${apiName}`);
  writeSuccess(" Valet site unlinked: ${apiName}.");

  await exec(`rm -rf ${apiName}`);
  writeSuccess(" Directory removed: ${apiName}.");

  await exec(`rm -rf ${appName}`);
  writeSuccess(" Directory removed: ${appName}.");
}

module.exports = destroy;
