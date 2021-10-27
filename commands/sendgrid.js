const chalk = require("chalk");
const { getProjectName } = require("../lib/app-name");

async function setupSendgridAccount() {
  let projectName = await getProjectName();

  console.log(
    chalk.bold.greenBright("⚡️⚡️⚡️ Setup Sendgrid account ⚡️⚡️⚡️")
  );

  console.log(projectName);
}

module.exports = setupSendgridAccount;
