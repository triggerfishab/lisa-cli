const conf = new (require("conf"))();
const prompt = require("prompt");
const chalk = require("chalk");
const fs = require("fs");
const { getTrellisPath } = require("./trellis");

async function getLisaVaultPass() {
  return conf.get("lisaVaultPass") || (await askForLisaVaultPass());
}

async function askForLisaVaultPass() {
  prompt.start();
  prompt.message = "";
  prompt.delimiter = chalk.greenBright(" >");

  let lisaVaultPassPrompt = {
    properties: {
      lisaVaultPass: {
        type: "string",
        description:
          "Enter the Vault Pass for the Lisa project (can be found in the Lisa item in 1Password).",
        required: true,
      },
    },
  };

  let { lisaVaultPass } = await prompt.get(lisaVaultPassPrompt);

  conf.set("lisaVaultPass", lisaVaultPass);

  return lisaVaultPass;
}

function getLisaVaultPassPath() {
  let trellisPath = getTrellisPath();
  return `${trellisPath}/.lisa_vault_pass`;
}

function getVaultPassPath() {
  let trellisPath = getTrellisPath();
  return `${trellisPath}/.vault_pass`;
}

async function writeTempLisaVaultPass() {
  let lisaVaultPass = await getLisaVaultPass();
  let lisaVaultPassFile = getLisaVaultPassPath();
  fs.writeFile(lisaVaultPassFile, lisaVaultPass, () => {});
}

async function removeTempLisaVaultPass() {
  let lisaVaultPassFile = getLisaVaultPassPath();

  fs.unlink(lisaVaultPassFile, () => {});
}

module.exports = {
  getLisaVaultPass,
  writeTempLisaVaultPass,
  removeTempLisaVaultPass,
  getLisaVaultPassPath,
  getVaultPassPath,
};
