const conf = require("../lib/conf")
const prompts = require("prompts")
const { program } = require("commander")
const { writeError, writeSuccess, writeInfo } = require("../lib/write")

program
  .command("configure")
  .description("Configure all credentials for third party services")
  .option(
    "--reset",
    "Reset the config for one or all services, see argument [service] for available services."
  )
  .argument(
    "[service]",
    "Pass an argument for which service to configure, available services: s3, stackpath, godaddy"
  )
  .action(configure)

async function configure(service, options) {
  let services = ["s3", "stackpath", "godaddy", "sendgrid"]

  let results = {}

  if (service) {
    if (!services.includes(service)) {
      writeError(
        `The service named ${service} is not available. The available services are: ${services.join(
          ", "
        )}`
      )
      process.exit()
    }

    services = [service]
  }

  if (options.reset) {
    for (let service of services) {
      conf.delete(service)
    }

    writeSuccess("Specified services config has been reset")
    return
  }

  for (let service of services) {
    switch (service) {
      case "s3": {
        if (conf.get(service)) {
          writeInfo("S3 credentials already set.")
          break
        }
        results[service] = await s3()
        break
      }

      case "stackpath": {
        if (conf.get(service)) {
          writeInfo("Stackpath credentials already set.")
          break
        }
        results[service] = await stackpath()
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

async function s3() {
  let s3Credentials = await prompts([
    {
      type: "text",
      message: "Enter the S3 access key ID",
      name: "accessKeyId",
      validate: (value) => Boolean(value),
    },
    {
      type: "invisible",
      message: "Enter the S3 secret access key (hidden input)",
      name: "secretAccessKey",
      validate: (value) => Boolean(value),
    },
    {
      type: "text",
      message: "Enter the S3 canonical user id",
      name: "canonicalUserId",
      validate: (value) => Boolean(value),
    },
  ])

  conf.set("s3", s3Credentials)
  writeSuccess("Your S3 credentials was saved.")

  return s3Credentials
}

async function stackpath() {
  let stackpathCredentials = await prompts([
    {
      type: "text",
      message: "Enter the Stackpath consumer key",
      name: "consumerKey",
      validate: (value) => Boolean(value),
    },
    {
      type: "invisible",
      message: "Enter the Stackpath consumer secret (hidden input)",
      name: "consumerSecret",
      validate: (value) => Boolean(value),
    },
    {
      type: "text",
      message: "Enter the Stackpath company alias",
      name: "alias",
      validate: (value) => Boolean(value),
    },
  ])

  conf.set("stackpath", stackpathCredentials)
  writeSuccess("Your Stackpath credentials was saved.")

  return stackpathCredentials
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

  conf.set("goDaddy", goDaddyCredentials)
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

module.exports = configure
