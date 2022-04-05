import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { writeInfo, writeSuccess } from "../lib/write.js"

async function installDependencies() {
  writeInfo("Installing dependencies.")

  let appPromise = installAppDependencies()
  let apiPromise = installApiDependencies()

  await Promise.all([appPromise, apiPromise])
  writeSuccess("All dependencies installed.")
}

async function installAppDependencies() {
  let appName = conf.get("appName")

  writeInfo("Installing app dependencies...")
  exec(`yarn --cwd=${appName}`)
}

async function installApiDependencies() {
  let apiName = conf.get("apiName")

  writeInfo("Installing composer dependencies...")

  let sitePromise = exec(`composer install --working-dir=${apiName}/site`)
  let themePromise = exec(
    `composer install --working-dir=${apiName}/site/web/app/themes/lisa`
  )

  return Promise.all([sitePromise, themePromise])
}

export default installDependencies
