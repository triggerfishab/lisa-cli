const conf = new (require("conf"))();
const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function installDependencies() {
  console.log(chalk.cyanBright("🪚 Install dependencies."));

  let appPromise = installAppDependencies();
  let apiPromise = installApiDependencies();

  await Promise.all([appPromise, apiPromise]);
  console.log(chalk.greenBright("🎉 All dependencies installed."));
}

async function installAppDependencies() {
  let appName = conf.get("appName");

  console.log(chalk.blue("⏰ Installing app dependencies..."));
  exec(`yarn --cwd=${appName}`);
}

async function installApiDependencies() {
  let apiName = conf.get("apiName");

  console.log(chalk.blue("⏰ Installing composer dependencies..."));

  let sitePromise = exec(`composer install --working-dir=${apiName}/site`);
  let themePromise = exec(
    `composer install --working-dir=${apiName}/site/web/app/themes/lisa`
  );

  return Promise.all([sitePromise, themePromise]);
}

module.exports = installDependencies;
