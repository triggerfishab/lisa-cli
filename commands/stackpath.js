/**
 * TODO:
 * replace request with fetch
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
const request = require("request")

program
  .command("stackpath")
  .description("Setup Stackpath")
  .action(setupStackpath)

async function setupStackpath() {
  let projectName = await getProjectName()
  let s3Bucket = conf.get("s3Bucket")
  let s3BucketUrl = conf.get("s3BucketUrl")

  let stackpath = conf.get("stackpath") || (await setup("stackpath")).stackpath

  const oauth = OAuth({
    consumer: { key: stackpath.consumerKey, secret: stackpath.consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto.createHmac("sha1", key).update(base_string).digest("base64")
    },
  })

  const request_data = {
    url: `https://api.stackpath.com/v1/${stackpath.alias}/sites`,
    method: "POST",
    data: {
      name: projectName,
      url: s3BucketUrl,
    },
  }

  request(
    {
      url: request_data.url,
      method: request_data.method,
      form: request_data.data,
      headers: oauth.toHeader(oauth.authorize(request_data)),
    },
    function (error, response, body) {
      body = JSON.parse(body)
      let { id } = body.data.pullzone

      const request_data = {
        url: `https://api.stackpath.com/v1/${stackpath.alias}/sites/${id}/customdomains`,
        method: "POST",
        data: {
          custom_domain: s3Bucket,
        },
      }

      request(
        {
          url: request_data.url,
          method: request_data.method,
          form: request_data.data,
          headers: oauth.toHeader(oauth.authorize(request_data)),
        },
        function (error, response, body) {
          console.log(body)
        }
      )
    }
  )
}

module.exports = setupStackpath
