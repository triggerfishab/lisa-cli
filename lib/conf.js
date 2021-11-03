const conf = new (require("conf"))();

async function resetConf() {
  let lisaVaultPass = conf.get("lisaVaultPass");
  let sitesPath = conf.get("sitesPath");

  conf.clear();

  if (sitesPath) {
    conf.set("sitesPath", sitesPath);
  }

  if (lisaVaultPass) {
    conf.set("lisaVaultPass", lisaVaultPass);
  }
}

module.exports = resetConf;
