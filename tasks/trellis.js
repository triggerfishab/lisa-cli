const fs = require("fs");
const conf = new (require("conf"))();
var generator = require("generate-password");

function addVaultPassword() {
  let apiName = conf.get("apiName");
  let password = generator.generate({
    length: 32,
    numbers: true,
  });

  conf.set("vaultPass", password);

  fs.writeFile(`${apiName}/trellis/.vault_pass`, password, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = { addVaultPassword };
