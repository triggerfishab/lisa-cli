import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { writeInfo, writeSuccess } from "../lib/write.js"

async function linkValetSite() {
  writeInfo("Linking site to Valet.")

  let apiName = conf.get("apiName")
  let tld = await getValetTld()
  let apiUrl = `https://${apiName}.${tld}`

  await exec(`valet link --secure ${apiName}`, { cwd: `${apiName}/site/web` })

  conf.set("apiUrl", apiUrl)
  writeSuccess(`Site linked as ${apiUrl}`)
}

export async function getValetTld() {
  let tld = await exec("valet tld")

  return tld.stdout.trim()
}

export default linkValetSite
