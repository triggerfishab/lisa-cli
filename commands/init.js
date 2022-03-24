const { createRepos } = require("./repo");
const { askForProjectName } = require("../lib/app-name");
const setupLocalSiteForDevelopment = require("./local");
const configureTrellisForKinsta = require("./kinsta");
const { getSitesPath } = require("../lib/path");
const { generateSecrets } = require("../lib/secrets");
const addSiteToVercel = require("../lib/vercel");
const { writeError, writeStep } = require("../lib/write");

async function init() {
  await getSitesPath();

  writeStep("Creating new Lisa project!");

  let nodeVersion = process.version.match(/^v(\d+)/)[1];

  if (nodeVersion < 12) {
    writeError(
      `You are running node version ${nodeVersion}. Please update to latest Node version.`
    );
    process.exit();
  }

  await askForProjectName();
  await createRepos();
  await setupLocalSiteForDevelopment();
  await configureTrellisForKinsta();
  await addSiteToVercel();
  await generateSecrets();

  writeStep("All done! Good luck and have fun!");
}

module.exports = init;
