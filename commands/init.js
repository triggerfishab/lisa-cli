const { program } = require("commander");
const { createRepos } = require("./repo");
const { askForProjectName } = require("../lib/app-name");
const setupLocalSiteForDevelopment = require("./local");
const configureTrellisForKinsta = require("./kinsta");
const { getSitesPath } = require("../lib/path");
const { generateSecrets } = require("../lib/secrets");
const addSiteToVercel = require("../lib/vercel");
const { writeStep } = require("../lib/write");

program
  .command("init")
  .description("Create a Lisa project")
  .option("--skip-github", "Skip setup for Git repositories")
  .action(init);

async function init() {
  await getSitesPath();

  writeStep("Creating new Lisa project!");

  await askForProjectName();
  await createRepos();
  await setupLocalSiteForDevelopment();
  await configureTrellisForKinsta();
  await addSiteToVercel();
  await generateSecrets();

  writeStep("All done! Good luck and have fun!");
}

module.exports = init;
