const conf = require("../lib/conf")
const prompts = require("prompts")
const { program } = require("commander")
const { writeError, writeSuccess } = require("../lib/write")

program
  .command("setup")
  .description("Setup all credentials for third party services")
  .argument(
    "[service]",
    "Pass an argument for which service to setup, available services: s3"
  )
  .action(setup)

async function setup(service) {
  let services = ["s3", "stackpath"]
  let results = {}

  if (service) {
    if (!services.includes(service)) {
      writeError(
        `🚔🚔🚔 The service named ${service} is not available. The available services are: ${services.join(
          ", "
        )}`
      )
      process.exit()
    }

    services = [service]
  }

  services.map(async (service) => {
    switch (service) {
      case "s3": {
        results["s3"] = await s3()
      }

      case "stackpath": {
        results["stackpath"] = await stackpath()
      }
    }
  })

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
  ])

  conf.set("s3", s3Credentials)
  writeSuccess("Your S3 credentials was saved.")

  return s3Credentials
}

async function stackpath() {
  let stackpathCredentials = await prompts([
    {
      type: "text",
      message: "Enter the Stackpath alias",
      name: "alias",
    },
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
  ])

  conf.set("stackpath", stackpathCredentials)
  writeSuccess("Your Stackpath credentials was saved.")
}

module.exports = setup
