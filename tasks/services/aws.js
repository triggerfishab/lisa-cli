import {
  CloudFrontClient,
  CreateDistributionCommand,
} from "@aws-sdk/client-cloudfront"
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3"
import configure from "../../commands/configure.js"
import { getProjectName } from "../../lib/app-name.js"
import conf from "../../lib/conf.js"
import * as store from "../../lib/store.js"

import { writeStep, writeSuccess } from "../../lib/write.js"

const DEFAULT_REGION = "eu-north-1"

async function setupAWS(environment = "production") {
  writeStep(`Setting up S3 bucket for ${environment} environment`)

  let projectName = await getProjectName()
  let bucketName = `${projectName}.cdn.triggerfish.cloud`

  if (environment === "staging") {
    bucketName = `staging-${bucketName}`
  }

  let aws = conf.get("aws") || (await configure("aws")).aws
  let { canonicalUserId } = aws

  try {
    const s3Client = new S3Client({
      region: DEFAULT_REGION,
      credentials: {
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey,
      },
      canonicalUserId,
    })

    const bucket = await s3Client.send(
      new CreateBucketCommand({ Bucket: bucketName })
    )

    writeSuccess(`S3 bucket for ${environment} created.`)

    let s3BucketUrl = `https://s3.${DEFAULT_REGION}.amazonaws.com/${bucketName}`

    store.set(`s3Bucket-${environment}`, bucketName)
    store.set(`s3BucketUrl-${environment}`, s3BucketUrl)

    let origin = bucket.Location.replace("http://", "")
    origin = origin.replace("/", "")

    const cloudFrontClient = new CloudFrontClient({
      region: DEFAULT_REGION,
      credentials: {
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey,
      },
    })

    const distributionConfig = {
      Aliases: {
        Quantity: 1,
        Items: [bucketName],
      },
      CallerReference: Date.now(),
      Comment: origin,
      Compress: true,
      DefaultCacheBehavior: {
        TargetOriginId: origin,
        ViewerProtocolPolicy: "allow-all",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Enabled: true,
      PriceClass: "PriceClass_100",
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: origin,
            DomainName: origin,
            S3OriginConfig: {
              OriginAccessIdentity: "",
            },
          },
        ],
      },
      ViewerCertificate: {
        ACMCertificateArn:
          "arn:aws:acm:us-east-1:928011160524:certificate/9afe4f04-7b2f-43bf-895f-ad75865aad5f",
        SSLSupportMethod: "sni-only",
        MinimumProtocolVersion: "TLSv1.2_2021",
      },
    }

    const command = new CreateDistributionCommand({
      DistributionConfig: distributionConfig,
    })

    const distribution = await cloudFrontClient.send(command)

    writeSuccess(`Cloudfront distribution for ${environment} created.`)

    store.set(`${environment}CdnUrl`, distribution.Distribution.DomainName)
  } catch (err) {
    console.error(err)
  }
}

export default setupAWS
