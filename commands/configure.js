import prompts from "prompts"

import conf from "../lib/conf.js"
import { writeError, writeInfo, writeSuccess } from "../lib/write.js"

async function configure(service, options) {
  let services = ["aws", "godaddy", "sendgrid"]
  options = options || {}

  let results = {}

  if (service) {
    if (!services.includes(service)) {
      writeError(
        `The service named ${service} is not available. The available services are: ${services.join(
          ", ",
        )}`,
      )
      process.exit()
    }

    services = [service]
  }

  if (typeof options.reset !== "undefined" && options.reset) {
    for (let service of services) {
      conf.delete(service)
    }

    writeSuccess("Specified services config has been reset")
    return
  }

  for (let service of services) {
    switch (service) {
      case "aws": {
        if (conf.get(service)) {
          writeInfo("AWS credentials already set.")
          break
        }
        results[service] = await aws()
        break
      }

      case "godaddy": {
        if (conf.get(service)) {
          writeInfo("GoDaddy credentials already set.")
          break
        }
        results[service] = await goDaddy()
        break
      }

      case "sendgrid": {
        if (conf.get(service)) {
          writeInfo("Sendgrid credentials already set.")
          break
        }
        results[service] = await sendgrid()
        break
      }
    }
  }

  return results
}

async function aws() {
  let awsCredentials = await prompts([
    {
      type: "text",
      message: "Enter the AWS access key ID",
      name: "accessKeyId",
      validate: (value) => Boolean(value),
    },
    {
      type: "invisible",
      message: "Enter the AWS secret access key (hidden input)",
      name: "secretAccessKey",
      validate: (value) => Boolean(value),
    },
    {
      type: "text",
      message: "Enter the AWS canonical user id",
      name: "canonicalUserId",
      validate: (value) => Boolean(value),
    },
  ])

  conf.set("aws", awsCredentials)
  writeSuccess("Your AWS credentials was saved.")

  return awsCredentials
}

async function goDaddy() {
  let goDaddyCredentials = await prompts([
    {
      type: "text",
      message: "Enter the GoDaddy API key",
      name: "key",
      validate: (value) => Boolean(value),
    },
    {
      type: "invisible",
      message: "Enter the GoDaddy API secret (hidden input)",
      name: "secret",
      validate: (value) => Boolean(value),
    },
  ])

  conf.set("godaddy", goDaddyCredentials)
  writeSuccess("Your GoDaddy credentials was saved.")

  return goDaddyCredentials
}

async function sendgrid() {
  let sendgridCredentials = await prompts([
    {
      type: "invisible",
      message: "Enter the Sendgrid api key (hidden input)",
      name: "apiKey",
      validate: (value) => Boolean(value),
    },
  ])

  conf.set("sendgrid", sendgridCredentials)
  writeSuccess("Your Sendgrid credentials was saved.")

  return sendgridCredentials
}

export default configure
