import { spawnSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"

import { getApiName, getAppName, getProjectName } from "./app-name.js"
import { writeStep, writeSuccess } from "./write.js"

export async function addSiteToVercel() {
  let appName = await getAppName()

  writeStep("Setting up site on Vercel.")

  spawnSync(`vercel link --yes`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  })

  writeSuccess("Site added to Vercel.")
}

export async function configureNextConfig() {
  const appName = await getAppName()
  const apiName = await getApiName()
  const projectName = await getProjectName()
  const path = `${appName}/next.config.js`
  let nextConfig = readFileSync(path, {
    encoding: "utf-8",
  })
  const [existingImageDomains] = nextConfig.match(/domains: \[(.*)\]/gm)

  const domains = `domains: [
      "${projectName}.cdn.triggerfish.cloud",
      "staging-${projectName}.cdn.triggerfish.cloud",
      "${apiName}.test"
    ]`

  nextConfig = nextConfig.replace(existingImageDomains, domains)
  writeFileSync(path, nextConfig)

  writeSuccess("Updated next.config.js with allowed image domains.")
}
