import prompts from "prompts"
import setupPath from "../commands/path.js"
import conf from "./conf.js"

export async function getSitesPath() {
  let sitesPath = conf.get("sitesPath")

  if (!sitesPath) {
    let { sitesPath } = await prompts([
      {
        type: "text",
        message:
          "Enter the full path for your sites, i.e. `/Users/username/Sites`",
        name: "sitesPath",
      },
    ])

    console.log(sitesPath)

    await setupPath(sitesPath)

    return sitesPath
  }

  return sitesPath
}
