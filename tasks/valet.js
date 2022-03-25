const exec = require("../lib/exec")
const { writeInfo, writeSuccess } = require("../lib/write")
const conf = require("../lib/conf")

async function linkValetSite() {
  writeInfo("Linking site to Valet.")

  let apiName = conf.get("apiName")
  let tld = await getValetTld()
  let apiUrl = `https://${apiName}.${tld}`

  await exec(`valet link --secure ${apiName}`, { cwd: `${apiName}/site/web` })

  conf.set("apiUrl", apiUrl)
  writeSuccess(`Site linked as ${apiUrl}`)
}

async function getValetTld() {
  let tld = await exec("valet tld")

  return tld.stdout.trim()
}

const valetModule = (module.exports = linkValetSite)
valetModule.getValetTld = getValetTld
