import exec from "../lib/exec.js"
import { getTrellisSitePath } from "./trellis.js"

export async function getAdminUrl() {
  const trellisSitePath = getTrellisSitePath()

  const apiUrl = await exec("wp option get home", {
    cwd: `${trellisSitePath}/web/app/themes/lisa`,
  })
  return apiUrl.stdout.trim()
}
