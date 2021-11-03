const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const generator = require("generate-password");
const { getTrellisPath, getGroupVarsPath } = require("../lib/trellis");
const {
  writeTempLisaVaultPass,
  getLisaVaultPassPath,
  getVaultPassPath,
  removeTempLisaVaultPass,
} = require("../lib/vault");
const conf = new (require("conf"))();

async function addVaultPassword() {
  let trellisPath = getTrellisPath();
  let vaultPassPath = `${trellisPath}/.vault_pass`;
  let password = generator.generate({
    length: 32,
    numbers: true,
  });

  fs.writeFile(vaultPassPath, password, (err) => {
    if (err) {
      console.log(err);
    }
  });

  conf.set("vaultPass", password);

  console.log(chalk.greenBright(`🎉 Vault pass written to ${vaultPassPath}.`));
}

async function changeVaultPasswords() {
  console.log();
  console.log(
    chalk.bold.greenBright(
      "⚡️⚡️⚡️ Update all vault files with new vault pass ⚡️⚡️⚡️"
    )
  );

  let lisaVaultPassPath = getLisaVaultPassPath();
  let vaultPassPath = getVaultPassPath();

  let allGroupVarsPath = getGroupVarsPath("all");
  let developmentGroupVarsPath = getGroupVarsPath("development");
  let stagingGroupVarsPath = getGroupVarsPath("staging");
  let productionGroupVarsPath = getGroupVarsPath("production");

  await writeTempLisaVaultPass();

  await exec(
    `ansible-vault decrypt ${allGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`
  );
  await exec(
    `ansible-vault encrypt ${allGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`
  );
  console.log(
    chalk.greenBright(`🎉 Vault pass updated on ${allGroupVarsPath}/vault.yml.`)
  );

  await exec(
    `ansible-vault decrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`
  );
  await exec(
    `ansible-vault encrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`
  );
  console.log(
    chalk.greenBright(
      `🎉 Vault pass updated on ${developmentGroupVarsPath}/vault.yml.`
    )
  );

  await exec(
    `ansible-vault decrypt ${stagingGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`
  );
  await exec(
    `ansible-vault encrypt ${stagingGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`
  );
  console.log(
    chalk.greenBright(
      `🎉 Vault pass updated on ${stagingGroupVarsPath}/vault.yml.`
    )
  );

  await exec(
    `ansible-vault decrypt ${productionGroupVarsPath}/vault.yml --vault-password-file ${lisaVaultPassPath}`
  );
  await exec(
    `ansible-vault encrypt ${productionGroupVarsPath}/vault.yml --vault-password-file ${vaultPassPath}`
  );
  console.log(
    chalk.greenBright(
      `🎉 Vault pass updated on ${productionGroupVarsPath}/vault.yml.`
    )
  );

  await removeTempLisaVaultPass();
}

module.exports = { addVaultPassword, changeVaultPasswords };
