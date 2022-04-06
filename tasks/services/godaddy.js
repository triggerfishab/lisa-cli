import fetch from "node-fetch"
import configure from "../../commands/configure.js"
import { getProjectName } from "../../lib/app-name.js"
import conf from "../../lib/conf.js"
import * as store from "../../lib/store.js"
import { writeError, writeStep, writeSuccess } from "../../lib/write.js"

async function goDaddy(environment = "production") {
  writeStep(`Setting up GoDaddy DNS record for your project.`)

  let godaddy = conf.get("godaddy") || (await configure("godaddy")).godaddy
  let projectName = await getProjectName()
  let stackpathCdnUrl = store.get(`stackpathCdnUrl-${environment}`)

  if (environment === "staging") {
    projectName = `staging-${projectName}`
  }

  try {
    await fetch(
      "https://api.godaddy.com/v1/domains/triggerfish.cloud/records",
      {
        method: "PATCH",
        headers: {
          Authorization: `sso-key ${godaddy.key}:${godaddy.secret}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            data: stackpathCdnUrl,
            name: `${projectName}.cdn`,
            ttl: 1800,
            type: "CNAME",
          },
        ]),
      }
    )

    writeSuccess(`GoDaddy DNS record added for your project.`)
  } catch (e) {
    writeError(
      "Error adding DNS records on GoDaddy. Create an issue (https://github.com/triggerfishab/lisa-cli/issues/new/choose) with the following info"
    )

    console.dir(e)
  }
}

export default goDaddy
