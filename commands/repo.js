const conf = new (require("conf"))();
const chalk = require("chalk");
const { program } = require("commander");
const util = require("util");
const { getApiName } = require("../lib/app-name");
const exec = util.promisify(require("child_process").exec);

async function createRepos() {
  let { skipGithub } = program.opts();

  if (skipGithub) {
    return;
  }

  console.log();
  console.log(
    chalk.cyanBright("🪚 Setting up repos at GitHub for app and api.")
  );

  let appName = conf.get("appName");
  let apiName = conf.get("apiName");

  let appGithubURL = `https://github.com/triggerfishab/${appName}`;
  let apiGithubURL = `https://github.com/triggerfishab/${apiName}`;

  let appResponse = await exec(
    `gh repo create -p triggerfishab/lisa-app ${appGithubURL} -y --private`
  );

  if (appResponse.error) {
    console.log(error);
    process.exit();
  }

  console.log(chalk.green(`🎉 Repo created: ${appGithubURL}.`));

  let apiResponse = await exec(
    `gh repo create -p triggerfishab/lisa-api ${apiGithubURL} -y --private`
  );

  if (apiResponse.error) {
    console.log(error);
    process.exit();
  }

  console.log(chalk.green(`🎉 Repo created: ${apiGithubURL}.`));
}

async function addGithubRepoSecrets() {
  let vaultPass = conf.get("vaultPass");
  let apiRepo = await getApiName();

  await exec(`gh secret set VAULT_PASS -b"${vaultPass}"`, { cwd: apiRepo });
  console.log(chalk.green(`🎉 Vault pass saved as secret for api repo.`));
}

async function cloneRepos() {
  let appName = conf.get("appName");
  let apiName = conf.get("apiName");

  await exec(`gh repo clone triggerfishab/${apiName}`);
  console.log(chalk.green(`🎉 Repo cloned: triggerfishab/${apiName}.`));

  await exec(`gh repo clone triggerfishab/${appName}`);
  console.log(chalk.green(`🎉 Repo cloned: triggerfishab/${appName}.`));
}

module.exports = { createRepos, addGithubRepoSecrets, cloneRepos };
