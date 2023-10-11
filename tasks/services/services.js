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
import setupAWS from "./aws.js"
import setupGoDaddy from "./godaddy.js"
import setupSendgridAccount from "./sendgrid.js"

async function setupServices() {
  writeStep(
    "Installing the following services for staging and production environment: Amason AWS, GoDaddy and Sendgrid!",
  )

  await getProjectName()

  await setupAWS("staging")
  await setupGoDaddy("staging")

  await setupAWS("production")
  await setupGoDaddy("production")

  await setupSendgridAccount()

  await writeTrellisConfig()
  await commitAndPushTrellisConfig()

  writeSuccess(
    "All services have been configured. You are now ready to go with Amazon AWS, GoDaddy and Sendgrid!",
  )
}

async function commitAndPushTrellisConfig() {
  let trellisPath = getTrellisPath()
  await exec("git add .", { cwd: trellisPath })
  await exec("git commit -m 'Trellis configuration triggered by Lisa CLI'", {
    cwd: trellisPath,
  })
  await exec("git push", { cwd: trellisPath })

  writeSuccess("Trellis config pushed to GitHub")
}

async function writeTrellisConfig() {
  let trellisPath = getTrellisPath()
  let s3BucketStaging = conf.get("s3Bucket-staging")
  let s3BucketProduction = conf.get("s3Bucket-production")
  let sendgridApiKey = store.get("sendgridApiKey")
  let awsConfig = conf.get("aws")

  writeStep("Writing all services data to vault files.")

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketStaging,
      tf_upload_media_to_s3: true,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketStaging,
    },
    "staging",
  )

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketProduction,
      tf_upload_media_to_s3: true,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketProduction,
    },
    "production",
  )

  writeEnvDataToWordPressSites(
    {
      s3_bucket: s3BucketStaging,
      tf_upload_media_to_s3: false,
      tf_serve_media_from_cdn: true,
      cdn_delivery_domain: s3BucketStaging,
    },
    "development",
  )

  writeEnvDataToVault(
    {
      s3_region: "eu-north-1",
      s3_access_key_id: awsConfig.accessKeyId,
      s3_secret_access_key: awsConfig.secretAccessKey,
    },
    "all",
  )

  writeEnvDataToVault(
    {
      tf_smtp_username: "apikey",
      tf_smtp_password: sendgridApiKey,
    },
    "production",
  )

  writeEnvDataToVault(
    {
      tf_smtp_username: "apikey",
      tf_smtp_password: sendgridApiKey,
    },
    "staging",
  )

  await exec("trellis dotenv", { cwd: trellisPath })

  writeSuccess("Trellis dotenv done.")
}

export default setupServices
