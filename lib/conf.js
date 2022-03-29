const conf = new (require("conf"))()

async function resetConf() {
  let lisaVaultPass = conf.get("lisaVaultPass")
  let sitesPath = conf.get("sitesPath")
  let s3 = conf.get("s3")
  let stackpath = conf.get("stackpath")

  conf.clear()

  if (sitesPath) {
    conf.set("sitesPath", sitesPath)
  }

  if (lisaVaultPass) {
    conf.set("lisaVaultPass", lisaVaultPass)
  }

  if (s3) {
    conf.set("s3", s3)
  }

  if (stackpath) {
    conf.set("stackpath", stackpath)
  }
}

module.exports = conf
module.exports.resetConf = resetConf
