const chalk = require("chalk");
const { askForProjectName } = require("../lib/app-name");
const { askForCorrectRepoNames } = require("../lib/clone");
const linkValetSite = require("../tasks/valet");
const installDependencies = require("../tasks/dependencies");
const conf = new (require("conf"))();
const util = require("util");
const { getTrellisPath } = require("../lib/trellis");
const prompts = require("prompts");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const dbImport = require("./db");

async function cloneLisaProject() {
  console.log(
    chalk.greenBright.bold("⚡️⚡️⚡️ Cloning Lisa project ⚡⚡️⚡️️")
  );
  console.log();

  let nodeVersion = process.version.match(/^v(\d+)/)[1];

  if (nodeVersion < 12) {
    console.log();
    console.log(
      chalk.bgRedBright.bold(
        `🚔🚔🚔 You are running node version ${nodeVersion}. Please update to latest Node version. 🚔🚔🚔`
      )
    );
    process.exit();
  }

  let projectName = await askForProjectName();

  let apiRepoName = `git@github.com:triggerfishab/${projectName}-api.git`;
  let appRepoName = `git@github.com:triggerfishab/${projectName}-app.git`;

  conf.set("apiRepoName", apiRepoName);
  conf.set("appRepoName", appRepoName);

  await askForCorrectRepoNames();

  apiRepoName = conf.get("apiRepoName");
  appRepoName = conf.get("appRepoName");

  let apiName = apiRepoName.split("/")[1].replace(".git", "");
  let appName = appRepoName.split("/")[1].replace(".git", "");

  conf.set("apiName", apiName);
  conf.set("appName", appName);

  await exec(`git clone ${apiRepoName}`);
  await exec(`git clone ${appRepoName}`);

  await installDependencies();
  await linkValetSite();

  let trellisPath = getTrellisPath();

  let { vaultPass } = await prompts({
    type: "invisible",
    message:
      "Enter the vault pass for the project, can be found under the project item in 1Password",
    name: "vaultPass",
  });

  let vaultPassPath = `${trellisPath}/.vault_pass`;

  fs.writeFile(vaultPassPath, vaultPass, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await exec(`trellis dotenv`, {
    cwd: trellisPath,
  });

  await exec(`wp db create`, {
    cwd: `${apiName}/site`,
  });

  let { doDbImport } = await prompts([
    {
      type: "confirm",
      name: "doDbImport",
      message: "Do you want to import a database?",
    },
  ]);

  if (doDbImport) {
    await dbImport();
  }
}

module.exports = cloneLisaProject;
