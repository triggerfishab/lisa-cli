const { getAppName } = require("./app-name")
const { spawnSync } = require("child_process")
const { writeStep, writeSuccess } = require("./write")

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

module.exports = addSiteToVercel
