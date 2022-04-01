const { getProjectName } = require("../lib/app-name")
const { program } = require("commander")
const setupS3Bucket = require("./s3")
const setupStackpath = require("./stackpath")
const setupGoDaddy = require("./godaddy")
const { writeStep, writeSuccess } = require("../lib/write")
const setupSendgridAccount = require("./sendgrid")
const {
  writeEnvDataToWordPressSites,
  writeEnvDataToVault,
} = require("../lib/vault")
const conf = require("../lib/conf")
const { getTrellisPath } = require("../lib/trellis")
const exec = require("../lib/exec")

program
  .command("services")
  .description(
    "Setup services (currently Amazon AWS S3 and Stackpath CDN, Sendgrid)"
  )
  .action(setupServices)

async function setupServices() {
  writeStep(
    "Installing the following services for staging and production environment: Amason AWS S3, StackPath, GoDaddy, Sendgrid"
  )

  await getProjectName()

  await setupS3Bucket("staging")
  await setupStackpath("staging")
  await setupGoDaddy("staging")

  await setupS3Bucket()
  await setupStackpath()
  await setupGoDaddy()

  await setupSendgridAccount()

  await writeTrellisConfig()

  writeSuccess(
    "All services have been configured. You are now ready to go with Amazon AWS S3, StackPath, GoDaddy and Sendgrid!"
  )
}

async function writeTrellisConfig() {
  let trellisPath = getTrellisPath()
  let s3BucketStaging = conf.get("s3Bucket-staging")
  let s3BucketProduction = conf.get("s3Bucket-production")
  let sendgridApiKey = conf.get("sendgridApiKey")
  let s3Config = conf.get("s3")

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketStaging,
      tf_upload_media_to_s3: true,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketStaging,
    },
    "staging"
  )

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketProduction,
      tf_upload_media_to_s3: true,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketProduction,
    },
    "production"
  )

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketStaging,
      tf_upload_media_to_s3: false,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketStaging,
    },
    "development"
  )

  writeEnvDataToVault(
    {
      s3_region: "eu-north-1",
      s3_access_key_id: s3Config.accessKeyId,
      s3_secret_access_key: s3Config.accessKeyId,
    },
    "all"
  )

  writeEnvDataToVault(
    {
      tf_smtp_username: "apikey",
      tf_smtp_password: sendgridApiKey,
    },
    "production"
  )

  writeEnvDataToVault(
    {
      tf_smtp_username: "apikey",
      tf_smtp_password: sendgridApiKey,
    },
    "staging"
  )

  await exec("trellis dotenv", { cwd: trellisPath })

  writeSuccess("Trellis dotenv done.")
}

module.exports = setupServices
