import { writeStep, writeSuccess, writeError } from "../lib/write.js"
import setupAWS from "../tasks/services/aws.js"
import setupGoDaddy from "../tasks/services/godaddy.js"
import { getProjectName, askForProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"

export async function createCdnS3GoDaddy() {
  writeStep(
    "Creating S3 Bucket, CloudFront Distribution & GoDaddy DNS Records!"
  )

  const cdnDomain = ".cdn.triggerfish.cloud"
  await getProjectName()

  if (conf.get("projectName").includes("staging")) {
    writeError(
      "Please do NOT include the word staging in your project name. This will be added automatically and buckets for both ennvironments will be created."
    )
    await askForProjectName()
  }

  await setupAWS("staging")
  await setupGoDaddy("staging")

  await setupAWS("production")
  await setupGoDaddy("production")

  writeSuccess(
    `Services created! The urls to be used are as follows: staging-${conf.get(
      "projectName"
    )}${cdnDomain}, ${conf.get("projectName")}${cdnDomain}`
  )
}
