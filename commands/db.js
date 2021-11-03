const fs = require("fs");
const prompts = require("prompts");
const { getProjectName } = require("../lib/app-name");
const { getTrellisPath, getTrellisSitePath } = require("../lib/trellis");
const util = require("util");
const chalk = require("chalk");
const exec = util.promisify(require("child_process").exec);

async function dbImport() {
  await getProjectName();

  let trellisPath = getTrellisPath();

  let { environment } = await prompts({
    type: "select",
    name: "environment",
    choices: [
      { title: "Staging", value: "staging" },
      { title: "Production", value: "production" },
    ],
    message: "From which environment do you want to import the database?",
  });

  let hostFile = fs.readFileSync(
    `${trellisPath}/hosts/${environment}`,
    "utf-8"
  );

  let mainFile = fs.readFileSync(
    `${trellisPath}/group_vars/${environment}/main.yml`,
    "utf-8"
  );

  let host = hostFile.match(/ansible_host=([^\s]+)/)[1];
  let port = hostFile.match(/ansible_ssh_port=([^\s]+)/)[1];
  let user = mainFile.match(/web_user: ([^\s]+)/)[1];
  let docroot = mainFile.match(/www_root: ([^\s]+)/)[1];

  console.log(chalk.blue(`⏰ Making database dump on ${environment}...`));

  await exec(
    `ssh ${user}@${host} -p ${port} 'wp db export --path="${docroot}/current/web/wp" ~/db.sql'`
  );

  console.log(
    chalk.greenBright(`🎉 Datebase dump on ${environment} successful created!`)
  );

  console.log(
    chalk.blue(`⏰ Downloading database dump from ${environment}...`)
  );

  await exec(`scp -P ${port} ${user}@${host}:~/db.sql .`);

  console.log(
    chalk.greenBright(
      `🎉 Datebase dump from ${environment} successful downloaded!`
    )
  );

  console.log(chalk.blue(`⏰ Importing database to local site...`));

  await exec(`wp db import db.sql --path="${getTrellisSitePath()}/web/wp"`);

  console.log(chalk.greenBright(`🎉 Datebase successfully imported!`));
}

module.exports = dbImport;
