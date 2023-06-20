import fetch from "node-fetch"
import { getProjectName } from "../../lib/app-name.js"
import * as store from "../../lib/store.js"
import { writeError, writeStep, writeSuccess } from "../../lib/write.js"
import exec from "../../lib/exec.js"

export async function createGoDaddyDnsRecord() {
  writeStep("Creating DNS-records in GoDaddy")
}

export async function recordExists() {
  writeStep("Checking if DNS-records exists in GoDaddy")
}

async function goDaddy(environment = "production") {
  writeStep(`Setting up GoDaddy DNS record for your project.`)

  const [apiKey, apiSecret] = await exec(
    `op item get l2i57yslyjfr5jsieew4imwxgq --fields label="godaddy.api key",label="godaddy.api secret"`
  ).then((res) => res.stdout.trim().split(","))

  let projectName = await getProjectName()
  let cdnUrl = store.get(`${environment}CdnUrl`)

  if (environment === "staging") {
    projectName = `staging-${projectName}`
  }

  try {
    await fetch(
      "https://api.godaddy.com/v1/domains/triggerfish.cloud/records",
      {
        method: "PATCH",
        headers: {
          Authorization: `sso-key ${apiKey}:${apiSecret}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            data: cdnUrl,
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
