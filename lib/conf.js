import Conf from "conf"

const conf = new Conf({ projectName: "lisa-cli" })

export async function resetConf() {
  const lisaVaultPass = conf.get("lisaVaultPass")
  const sitesPath = conf.get("sitesPath")
  const aws = conf.get("aws")
  const goDaddy = conf.get("godaddy")
  const sendgrid = conf.get("sendgrid")

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
