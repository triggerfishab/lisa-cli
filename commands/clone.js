const chalk = require("chalk");
const { askForProjectName } = require("../lib/app-name");
const { askForCorrectRepoNames } = require("../lib/clone");
const linkValetSite = require("../tasks/valet");
const installDependencies = require("../tasks/dependencies");
const conf = require("../lib/conf");
const { getTrellisPath } = require("../lib/trellis");
const prompts = require("prompts");
const exec = require("../lib/exec");
const { spawnSync } = require("child_process");
const fs = require("fs");
const dbImport = require("./db");
const { getAdminUrl } = require("../lib/wordpress");
const { program } = require("commander");
const { writeStep, writeError, writeSuccess } = require("../lib/write");

program
  .command("clone")
  .description("Clone an existing Lisa project for local development")
  .action(cloneLisaProject);

async function cloneLisaProject() {
  writeStep("Cloning Lisa project");

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

  writeSuccess("Generated .env file with trellis-cli.");

  await exec(`wp db create`, {
    cwd: `${apiName}/site`,
  });

  writeSuccess("Created empty local database.");

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

  spawnSync(`vercel link`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  });

  spawnSync(`vercel env pull .env.local`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  });

  writeSuccess(
    "Generated .env.local file with environment variables from Vercel."
  );

  let adminUrl = await getAdminUrl();

  writeSuccess(chalk.bold("All done!"));
  writeSuccess(`Admin URL: ${chalk.underline(adminUrl)}/wp/wp-admin`);
  writeSuccess(
    `Run this command for local development: ${chalk.underline(
      `cd ${appName} && yarn dev`
    )}`
  );
}

module.exports = cloneLisaProject;
