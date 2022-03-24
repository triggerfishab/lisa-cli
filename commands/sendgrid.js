const chalk = require("chalk");
const { getProjectName } = require("../lib/app-name");
const { program } = require('commander');

program
    .command("sendgrid setup")
    .description("Setup Sendgrid account")
    .action(setupSendgridAccount);

async function setupSendgridAccount() {
  let projectName = await getProjectName();

  console.log(
    chalk.bold.greenBright("⚡️⚡️⚡️ Setup Sendgrid account ⚡️⚡️⚡️")
  );

  console.log(projectName);
}

module.exports = setupSendgridAccount;
