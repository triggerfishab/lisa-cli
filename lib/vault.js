const conf = require("./conf");
const fs = require("fs");
const { getTrellisPath } = require("./trellis");
const prompts = require("prompts");

async function getLisaVaultPass() {
  return conf.get("lisaVaultPass") || (await askForLisaVaultPass());
}

async function askForLisaVaultPass() {
  let { lisaVaultPass } = await prompts({
    type: "text",
    name: "lisaVaultPass",
    message:
      "Enter the Vault Pass for the Lisa project (can be found in the Lisa item in 1Password).",
  });

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
