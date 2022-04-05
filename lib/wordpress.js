import exec from "../lib/exec.js"
import { getTrellisSitePath } from "./trellis.js"

export async function getAdminUrl() {
  let trellisSitePath = getTrellisSitePath()

  let apiUrl = await exec(`wp option get home`, {
    cwd: `${trellisSitePath}/web/app/themes/lisa`,
  })
  return apiUrl.stdout.trim()
}
