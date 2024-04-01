import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { writeInfo, writeSuccess } from "../lib/write.js"

async function installDependencies() {
  writeInfo("Installing dependencies.")

  const appPromise = installAppDependencies()
  const apiPromise = installApiDependencies()

  await Promise.all([appPromise, apiPromise])
  writeSuccess("All dependencies installed.")
}

async function installAppDependencies() {
  const appName = conf.get("appName")

  writeInfo("Installing app dependencies...")
  exec(`yarn --cwd=${appName}`)
}

async function installApiDependencies() {
  const apiName = conf.get("apiName")

  writeInfo("Installing composer dependencies...")

  const sitePromise = exec(`composer install --working-dir=${apiName}/site`)
  const themePromise = exec(
    `composer install --working-dir=${apiName}/site/web/app/themes/lisa`,
  )

  return Promise.all([sitePromise, themePromise])
}

export default installDependencies
