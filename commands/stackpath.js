import crypto from "crypto"
import fetch from "node-fetch"
import OAuth from "oauth-1.0a"
import { getProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import * as store from "../lib/store.js"
import { writeStep, writeSuccess } from "../lib/write.js"
import configure from "./configure.js"

async function setupStackpath(environment = "production") {
  writeStep(`Setting up StackPath site for ${environment} environment`)

  let projectName = await getProjectName()
  let s3Bucket = conf.get(`s3Bucket-${environment}`)
  let s3BucketUrl = conf.get(`s3BucketUrl-${environment}`)

  if (environment === "staging") {
    projectName = `staging-${projectName}`
  }

  let stackpath =
    conf.get("stackpath") || (await configure("stackpath")).stackpath

  try {
    let json = await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites`,
      method: "POST",
      data: {
        name: projectName,
        url: s3BucketUrl,
      },
    })

    writeSuccess(`StackPath site created for ${environment} environment`)

    store.set(`stackpathCdnUrl-${environment}`, json.data.pullzone.cdn_url)

    await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites/${json.data.pullzone.id}/customdomains`,
      method: "POST",
      data: {
        custom_domain: s3Bucket,
        url: s3BucketUrl,
      },
    })

    writeSuccess(`Custom domain added for ${environment} environment`)

    await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites/${json.data.pullzone.id}/ssl`,
      method: "POST",
      data: {
        ssl_id: "26751",
        ssl_sni: "1",
      },
    })

    writeSuccess(`SSL certificate installed for ${environment} environment`)
  } catch (e) {
    console.log(e)
  }
}

async function request(data) {
  let stackpath =
    conf.get("stackpath") || (await configure("stackpath")).stackpath

  const oauth = OAuth({
    consumer: { key: stackpath.consumerKey, secret: stackpath.consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto.createHmac("sha1", key).update(base_string).digest("base64")
    },
  })

  let response = await fetch(data.url, {
    method: data.method,
    body: new URLSearchParams(data.data),
    headers: {
      ...oauth.toHeader(oauth.authorize(data)),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return await response.json()
}

export default setupStackpath
