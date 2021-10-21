const conf = new (require("conf"))();
const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function createRepos(skipGithub) {
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

  let appRepoPromise = exec(
    `gh repo create -p triggerfishab/lisa-app ${appGithubURL} -y --private`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit();
      }

      console.log(chalk.green(`🎉 Repo created: ${appGithubURL}.`));
    }
  );

  let apiRepoPromise = exec(
    `gh repo create -p triggerfishab/lisa-api ${apiGithubURL} -y --private`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit();
      }

      console.log(chalk.green(`🎉 Repo created: ${apiGithubURL}.`));
    }
  );

  await Promise.all([appRepoPromise, apiRepoPromise]);
}

module.exports = createRepos;
