const conf = new (require("conf"))();
const prompt = require("prompt");
const chalk = require("chalk");

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

module.exports = { getLisaVaultPass };
