const { getProjectName } = require("../lib/app-name")
const setup = require("./setup")
const conf = require("../lib/conf")
const exec = require("../lib/exec")
const { program } = require("commander")

program.command("s3").description("Setup S3 bucket").action(setupS3Bucket)

async function setupS3Bucket() {
  let projectName = await getProjectName()
  let bucketName = `${projectName}.cdn.triggerfish.cloud`
  let s3 = conf.get("s3") || (await setup("s3")).s3

  process.env.AWS_ACCESS_KEY_ID = s3.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = s3.secretAccessKey
  process.env.AWS_DEFAULT_REGION = "eu-north-1"

  await exec(`aws s3 mb s3://${bucketName}`)
  await exec(
    `aws s3api put-bucket-acl --bucket ${bucketName} --acl public-read`
  )

  let s3BucketUrl = `https://s3.eu-north-1.amazonaws.com/${bucketName}`
  conf.set("s3Bucket", bucketName)
  conf.set("s3BucketUrl", s3BucketUrl)
}

module.exports = setupS3Bucket
