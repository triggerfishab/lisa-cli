import prompts from "prompts"
import { askForProjectName, getProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import { writeError, writeStep, writeSuccess } from "../lib/write.js"
import setupAWS from "../tasks/services/aws.js"
import setupGoDaddy from "../tasks/services/godaddy.js"

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
      ", "
    )}`
  )
}
