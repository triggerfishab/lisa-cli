const { askForProjectName, getApiName, getAppName } = require("../lib/app-name");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");
const prompts = require("prompts");

async function destroy() {
  await askForProjectName()

  let appName = await getAppName()
  let apiName = await getApiName()

  let databaseName = await exec("wp config get DB_NAME", { cwd: `${apiName}/site` })

  console.log(`
${chalk.bold("The following will be removed:")}
${apiName} local site
${appName} directory
${apiName} directory
${databaseName.stdout.trim()} database`)
  
  let { confirm } = await prompts({
    type:"confirm",
    name: "confirm",
    message: "Are you sure you want to proceed?"
  })

  if (!confirm) {
    console.log(chalk.redBright("🚨 No changes made, kthxbye!"))
    process.exit()
  }

  await exec("wp db drop --yes", {cwd: `${apiName}/site`})
  console.log(chalk.green(`🎉 Local database ${apiName} removed.`));

  await exec(`valet unlink ${apiName}`)
  console.log(chalk.green(`🎉 Valet site unlinked: ${apiName}.`));

  await exec(`rm -rf ${apiName}`)
  console.log(chalk.green(`🎉 Directory removed: ${apiName}.`));

  await exec(`rm -rf ${appName}`)
  console.log(chalk.green(`🎉 Directory removed: ${appName}.`));
}

module.exports = destroy
