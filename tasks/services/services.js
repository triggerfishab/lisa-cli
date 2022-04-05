import { getProjectName } from "../../lib/app-name.js"
import conf from "../../lib/conf.js"
import exec from "../../lib/exec.js"
import * as store from "../../lib/store.js"
import { getTrellisPath } from "../../lib/trellis.js"
import {
  writeEnvDataToVault,
  writeEnvDataToWordPressSites,
} from "../../lib/vault.js"
import { writeStep, writeSuccess } from "../../lib/write.js"
import setupGoDaddy from "./godaddy.js"
import setupS3Bucket from "./s3.js"
import setupSendgridAccount from "./sendgrid.js"
import setupStackpath from "./stackpath.js"

async function setupServices() {
  writeStep(
    "Installing the following services for staging and production environment: Amason AWS S3, StackPath, GoDaddy, Sendgrid"
  )

  await getProjectName()

  await setupS3Bucket("staging")
  await setupStackpath("staging")
  await setupGoDaddy("staging")

  await setupS3Bucket("production")
  await setupStackpath("production")
  await setupGoDaddy("production")

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
  let sendgridApiKey = store.get("sendgridApiKey")
  let s3Config = conf.get("s3")

  writeStep("Writing all services data to vault files.")

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
      s3_secret_access_key: s3Config.secretAccessKey,
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

export default setupServices
