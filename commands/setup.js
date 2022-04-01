const conf = require("../lib/conf")
const prompts = require("prompts")
const { program } = require("commander")
const { writeError, writeSuccess } = require("../lib/write")

program
  .command("setup")
  .description("Setup all credentials for third party services")
  .argument(
    "[service]",
    "Pass an argument for which service to setup, available services: s3, stackpath, godaddy"
  )
  .action(setup)

async function setup(service) {
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

  for (const key in services) {
    switch (services[key]) {
      case "s3": {
        results["s3"] = await s3()
        break
      }

      case "stackpath": {
        results["stackpath"] = await stackpath()
        break
      }

      case "godaddy": {
        results["goDaddy"] = await goDaddy()
        break
      }

      case "sendgrid": {
        results["sendgrid"] = await sendgrid()
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
    },
    {
      type: "invisible",
      message: "Enter the S3 secret access key (hidden input)",
      name: "secretAccessKey",
    },
    {
      type: "text",
      message: "Enter the S3 canonical user id",
      name: "canonicalUserId",
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
    },
    {
      type: "invisible",
      message: "Enter the Stackpath consumer secret (hidden input)",
      name: "consumerSecret",
    },
    {
      type: "text",
      message: "Enter the Stackpath company alias",
      name: "alias",
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
    },
    {
      type: "invisible",
      message: "Enter the GoDaddy API secret (hidden input)",
      name: "secret",
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
    },
  ])

  conf.set("sendgrid", sendgridCredentials)
  writeSuccess("Your Sendgrid credentials was saved.")

  return sendgridCredentials
}

module.exports = setup
