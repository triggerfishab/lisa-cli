import { spawnSync } from "child_process"
import { getAppName } from "./app-name.js"
import { writeStep, writeSuccess } from "./write.js"

async function addSiteToVercel() {
  let appName = await getAppName()

  writeStep("Setting up site on Vercel.")

  spawnSync(`vercel link --confirm`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  writeSuccess("Site added to Vercel.")
}

export default addSiteToVercel
