const chalk = require("chalk");
const fs = require("fs");
const conf = new (require("conf"))();
const generator = require("generate-password");

async function addVaultPassword() {
  let apiName = conf.get("apiName");
  let path = `${apiName}/trellis/.vault_pass`;
  let password = generator.generate({
    length: 32,
    numbers: true,
  });

  conf.set("vaultPass", password);

  fs.writeFile(path, password, (err) => {
    if (err) {
      console.log(err);
    }
  });

  console.log(chalk.greenBright(`🎉 Vault pass written to ${path}.`));
}

module.exports = { addVaultPassword };
