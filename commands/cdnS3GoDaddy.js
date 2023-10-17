import prompts from "prompts"

import { askForProjectName, getProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import { writeError, writeStep, writeSuccess } from "../lib/write.js"
import {
  createIAMUserIfNotExists,
  findDistibutionForBucket,
  getAndUpdateDistributionConfig,
  listCloudFrontDistributions,
  putBucketLifeCycleRule,
  putBucketPolicy,
  putBucketPublicAccessBlock,
  setupAWS,
} from "../tasks/services/aws.js"
import setupGoDaddy from "../tasks/services/godaddy.js"

async function createCdnS3GoDaddy() {
  writeStep(
    "Creating S3 Bucket, CloudFront Distribution & GoDaddy DNS Records!",
  )

  const cdnDomain = ".cdn.triggerfish.cloud"
  await getProjectName()

  if (conf.get("projectName").includes("staging")) {
    writeError(
      "Please do NOT include the word staging in your project name. This will be added automatically and buckets for both ennvironments will be created.",
    )
    await askForProjectName()
  }

  const { environments } = await prompts([
    {
      type: "multiselect",
      name: "environments",
      message: "Select environment",
      instructions: "",
      choices: [
        { title: "Staging", value: "staging", selected: false },
        { title: "Production", value: "production", selected: false },
      ],
      hint: "- Space to select. Return to submit",
      min: 1,
    },
  ])

  const cdnUrls = []

  if (environments.includes("staging")) {
    await setupAWS("staging")
    await setupGoDaddy("staging")
    cdnUrls.push(`staging-${conf.get("projectName")}${cdnDomain}`)
  }

  if (environments.includes("production")) {
    await setupAWS("production")
    await setupGoDaddy("production")
    cdnUrls.push(`${conf.get("projectName")}${cdnDomain}`)
  }

  writeSuccess(
    `Services created! The urls to be used are as follows: ${cdnUrls.join(
      ", ",
    )}`,
  )
}

async function updateBucketAccessPolicyAndCreateIAMUser() {
  writeStep("Creation of IAM User started.")

  const cdnDomain = "cdn.triggerfish.cloud"
  await getProjectName()

  if (conf.get("projectName").includes("staging")) {
    writeError(
      "Please do NOT include the word staging in your project name. The user will be granted access to both ennvironments.",
    )
    await askForProjectName()
  }

  if (conf.get("projectName").includes(cdnDomain)) {
    writeError(
      `Please do NOT include ${cdnDomain} in your project name. This will be added automatically.`,
    )
    await askForProjectName()
  }

  const projectName = await getProjectName()
  await createIAMUserIfNotExists(`${projectName}.${cdnDomain}`)

  const { environments } = await prompts([
    {
      type: "multiselect",
      name: "environments",
      message: `Select environment(s) to update access policy for bucket ${projectName}.${cdnDomain}`,
      instructions: "",
      choices: [
        { title: "Staging", value: "staging", selected: false },
        { title: "Production", value: "production", selected: false },
      ],
      hint: "- Space to select. Return to submit",
      min: 1,
    },
  ])

  // Find matching distributions to add Cloudfront access policy to
  const distributions = await listCloudFrontDistributions()

  let bucketName = `${projectName}.${cdnDomain}`

  if (environments.includes("staging")) {
    bucketName = `staging-${bucketName}`

    const distribution = await findDistibutionForBucket(
      bucketName,
      distributions,
    )
    if (distribution) {
      writeSuccess(`Found distribution for bucket ${bucketName}`)
      await getAndUpdateDistributionConfig(distribution.id)
      await putBucketPublicAccessBlock(bucketName)
      await putBucketPolicy(bucketName)
    }
  }

  if (environments.includes("production")) {
    const distribution = await findDistibutionForBucket(
      bucketName,
      distributions,
    )
    if (distribution) {
      writeSuccess(`Found distribution for bucket ${bucketName}`)
      await getAndUpdateDistributionConfig(distribution.id)
      await putBucketPublicAccessBlock(bucketName)
      await putBucketPolicy(bucketName)
    }
  }
}

async function updateBucketLicecyclePolicy() {
  const cdnDomain = "cdn.triggerfish.cloud"
  await getProjectName()

  if (conf.get("projectName").includes("staging")) {
    writeError(
      "Please do NOT include the word staging in your project name. The user will be granted access to both ennvironments.",
    )
    await askForProjectName()
  }

  if (conf.get("projectName").includes(cdnDomain)) {
    writeError(
      `Please do NOT include ${cdnDomain} in your project name. This will be added automatically.`,
    )
    await askForProjectName()
  }

  const projectName = await getProjectName()

  const { environments } = await prompts([
    {
      type: "multiselect",
      name: "environments",
      message: `Select environment(s) to update access policy for bucket ${projectName}.${cdnDomain}`,
      instructions: "",
      choices: [
        { title: "Staging", value: "staging", selected: false },
        { title: "Production", value: "production", selected: false },
      ],
      hint: "- Space to select. Return to submit",
      min: 1,
    },
  ])

  if (environments.includes("staging")) {
    await putBucketLifeCycleRule(`staging-${projectName}.${cdnDomain}`)
  }

  if (environments.includes("production")) {
    await putBucketLifeCycleRule(`${projectName}.${cdnDomain}`)
  }
}

export {
  createCdnS3GoDaddy,
  updateBucketAccessPolicyAndCreateIAMUser,
  updateBucketLicecyclePolicy,
}
