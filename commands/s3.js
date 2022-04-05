import { getProjectName } from "../lib/app-name.js"
import conf from "../lib/conf.js"
import exec from "../lib/exec.js"
import { writeStep, writeSuccess } from "../lib/write.js"
import configure from "./configure.js"

async function setupS3Bucket(environment = "production") {
  writeStep(`Setting up S3 bucket for ${environment} environment`)

  let projectName = await getProjectName()
  let bucketName = `${projectName}.cdn.triggerfish.cloud`

  if (environment === "staging") {
    bucketName = `staging-${bucketName}`
  }

  let s3 = conf.get("s3") || (await configure("s3")).s3
  let { canonicalUserId } = s3

  process.env.AWS_ACCESS_KEY_ID = s3.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = s3.secretAccessKey
  process.env.AWS_DEFAULT_REGION = "eu-north-1"

  await exec(`aws s3 mb s3://${bucketName}`)

  writeSuccess(`S3 bucket for ${environment} created.`)

  await exec(
    `aws s3api put-bucket-acl --grant-full-control id=${canonicalUserId} --bucket ${bucketName} --grant-read uri=http://acs.amazonaws.com/groups/global/AllUsers`
  )

  writeSuccess(`Correct permissions configured for ${environment}`)

  let s3BucketUrl = `https://s3.eu-north-1.amazonaws.com/${bucketName}`

  conf.set(`s3Bucket-${environment}`, bucketName)
  conf.set(`s3BucketUrl-${environment}`, s3BucketUrl)
}

export default setupS3Bucket
