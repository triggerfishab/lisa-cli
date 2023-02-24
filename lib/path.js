import setupPath from "../commands/path.js"
import conf from "./conf.js"

export async function getSitesPath() {
  let sitesPath = conf.get("sitesPath")

  if (!sitesPath) {
    await setupPath()
    sitesPath = conf.get("sitesPath")
  }

  return sitesPath
}
