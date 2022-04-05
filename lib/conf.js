import Conf from "conf"
const conf = new Conf({ projectName: "lisa-cli" })

export async function resetConf() {
  let lisaVaultPass = conf.get("lisaVaultPass")
  let sitesPath = conf.get("sitesPath")
  let s3 = conf.get("s3")
  let stackpath = conf.get("stackpath")
  let goDaddy = conf.get("godaddy")
  let sendgrid = conf.get("sendgrid")

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

  if (goDaddy) {
    conf.set("godaddy", goDaddy)
  }

  if (sendgrid) {
    conf.set("sendgrid", sendgrid)
  }
}

export default conf
