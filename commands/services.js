const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const setupS3Bucket = require("./s3")
const setupStackpath = require("./stackpath")
const setupGoDaddy = require("./godaddy")

program
  .command("services")
  .description("Setup services (currently Amazon AWS S3 and Stackpath CDN)")
  .action(setupServices)

async function setupServices() {
  await getProjectName()

  await setupS3Bucket("staging")
  await setupStackpath("staging")
  await setupGoDaddy("staging")

  await setupS3Bucket()
  await setupStackpath()
  await setupGoDaddy()
}

module.exports = setupServices
