import Conf from "conf"

const conf = new Conf({ projectName: "lisa-cli" })

export async function resetConf() {
  let lisaVaultPass = conf.get("lisaVaultPass")
  let sitesPath = conf.get("sitesPath")
  let aws = conf.get("aws")
  let goDaddy = conf.get("godaddy")
  let sendgrid = conf.get("sendgrid")

  conf.clear()

  if (sitesPath) {
    conf.set("sitesPath", sitesPath)
  }

  if (lisaVaultPass) {
    conf.set("lisaVaultPass", lisaVaultPass)
  }

  if (aws) {
    conf.set("aws", aws)
  }

  if (goDaddy) {
    conf.set("godaddy", goDaddy)
  }

  if (sendgrid) {
    conf.set("sendgrid", sendgrid)
  }
}

export default conf
