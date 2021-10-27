const conf = new (require("conf"))();
const chalk = require("chalk");
const { program } = require("commander");
const util = require("util");
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

module.exports = createRepos;
