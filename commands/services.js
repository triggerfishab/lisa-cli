const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const setupS3Bucket = require("./s3")
const setupStackpath = require("./stackpath")
const setupGoDaddy = require("./godaddy")
const { writeStep } = require("../lib/write")
const setupSendgridAccount = require("./sendgrid")

program
  .command("services")
  .description("Setup services (currently Amazon AWS S3 and Stackpath CDN)")
  .action(setupServices)

async function setupServices() {
  writeStep(
    "Installing the following services for staging and production environment: Amason AWS S3, StackPath, GoDaddy"
  )

  await getProjectName()

  await setupS3Bucket("staging")
  await setupStackpath("staging")
  await setupGoDaddy("staging")

  await setupS3Bucket()
  await setupStackpath()
  await setupGoDaddy()

  await setupSendgridAccount()
}

module.exports = setupServices
