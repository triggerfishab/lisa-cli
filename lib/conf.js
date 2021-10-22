const conf = new (require("conf"))();

async function resetConf() {
  let lisaVaultPass = conf.get("lisaVaultPass");

  conf.clear();

  if (lisaVaultPass) {
    conf.set("lisaVaultPass", lisaVaultPass);
  }
}

module.exports = resetConf;
