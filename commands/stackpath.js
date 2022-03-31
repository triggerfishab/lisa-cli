/**
 * TODO:
 * generate correct url for site names
 * get correct s3 bucket url
 * add correct custom domain
 */

const { getProjectName } = require("../lib/app-name")
const setup = require("./setup")
const conf = require("../lib/conf")
const { program } = require("commander")
const crypto = require("crypto")
const OAuth = require("oauth-1.0a")
const fetch = require("node-fetch")
const store = require("../lib/store")

program
  .command("stackpath")
  .description("Setup Stackpath")
  .action(setupStackpath)

async function setupStackpath() {
  let projectName = await getProjectName()
  let s3Bucket = conf.get("s3Bucket")
  let s3BucketUrl = conf.get("s3BucketUrl")

  let stackpath = conf.get("stackpath") || (await setup("stackpath")).stackpath

  try {
    let json = await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites`,
      method: "POST",
      data: {
        name: projectName,
        url: s3BucketUrl,
      },
    })

    store.set("stackpathCdnUrl", json.data.pullzone.cdn_url)

    await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites/${json.data.pullzone.id}/customdomains`,
      method: "POST",
      data: {
        custom_domain: s3Bucket,
        url: s3BucketUrl,
      },
    })

    await request({
      url: `https://api.stackpath.com/v1/${stackpath.alias}/sites/${json.data.pullzone.id}/ssl`,
      method: "POST",
      data: {
        ssl_id: "26751",
        ssl_sni: "1",
      },
    })
  } catch (e) {
    console.log(e)
  }
}

async function request(data) {
  let stackpath = conf.get("stackpath") || (await setup("stackpath")).stackpath

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

module.exports = setupStackpath
