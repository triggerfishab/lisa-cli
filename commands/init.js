import { addCredentialsTo1Password } from "../lib/1password.js"
import { askForProjectName } from "../lib/app-name.js"
import { configureTrellisForKinsta } from "../lib/kinsta.js"
import { getSitesPath } from "../lib/path.js"
import { generateSecrets } from "../lib/secrets.js"
import { writeSummary } from "../lib/summary.js"
import { isTriggerfishOfficeIp } from "../lib/triggerfish.js"
import { addSiteToVercel, configureNextConfig } from "../lib/vercel.js"
import { writeStep } from "../lib/write.js"
import setupLocalSiteForDevelopment from "../tasks/local.js"
import { createRepos } from "../tasks/repo.js"
import setupServices from "../tasks/services/services.js"

export async function init({ configFile }) {
  await getSitesPath()

  writeStep("Creating new Lisa project!")
  await isTriggerfishOfficeIp()
  await askForProjectName()
  await createRepos()
  await setupLocalSiteForDevelopment()
  await configureTrellisForKinsta(configFile || "")
  await addSiteToVercel()
  await configureNextConfig()
  await generateSecrets()
  await setupServices()
  await addCredentialsTo1Password()
  await writeSummary()

  writeStep("All done! Good luck and have fun!")
}

export default init
