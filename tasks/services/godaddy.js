import fetch from "node-fetch"

import { getProjectName } from "../../lib/app-name.js"
import exec from "../../lib/exec.js"
import * as store from "../../lib/store.js"
import { writeError, writeStep, writeSuccess } from "../../lib/write.js"

export async function createGoDaddyDnsRecord(recordData) {
  const { type, name, data } = recordData
  writeStep("Creating DNS-records in GoDaddy")

  const [apiKey, apiSecret] = await getCredentials()

  let response
  try {
    response = await fetch(
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
            data,
            name,
            type,
            ttl: 1800,
          },
        ]),
      },
    )
    let body = await response.text()

    if (response?.ok) {
      writeSuccess(`DNS-record for ${name}.triggerfish.cloud created.`)
    } else {
      writeError("Error creating DNS-record in GoDaddy")
      writeError(`Status: ${response?.status}, message: ${body?.message}`)
    }
  } catch (error) {
    writeError(
      "Error adding DNS records on GoDaddy. Create an issue (https://github.com/triggerfishab/lisa-cli/issues/new/choose) with the following info",
    )
    console.dir(error)
  }
}

async function getCredentials() {
  try {
    return await exec(
      `op item get uhfxs25bmpaqk24fay4wz7qsie --fields label="godaddy.api key",label="godaddy.api secret"`,
    ).then((res) => res.stdout.trim().split(","))
  } catch (error) {
    writeError(`Failed accessing 1Password. \n ${error}`)
    process.exit(1)
  }
}

async function goDaddy(environment = "production") {
  writeStep(`Setting up GoDaddy DNS record for your project.`)

  let projectName = await getProjectName()
  let cdnUrl = store.get(`${environment}CdnUrl`)

  if (environment === "staging") {
    projectName = `staging-${projectName}`
  }

  createGoDaddyDnsRecord({
    type: "CNAME",
    name: `${projectName}.cdn`,
    data: cdnUrl,
  })
}

export default goDaddy
