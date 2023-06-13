import {
  CloudFrontClient,
  CreateDistributionCommand,
} from "@aws-sdk/client-cloudfront"
import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutBucketVersioningCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import configure from "../../commands/configure.js"
import { getProjectName } from "../../lib/app-name.js"
import conf from "../../lib/conf.js"
import * as store from "../../lib/store.js"
import { writeStep, writeSuccess } from "../../lib/write.js"

const DEFAULT_REGION = "eu-north-1"

async function setupAWS(environment = "production") {
  writeStep(`Setting up S3 bucket for ${environment} environment`)

  const projectName = await getProjectName()
  const bucketName = `${environment === "staging" ? "staging-" : ""}${projectName}.cdn.triggerfish.cloud`

  const { aws: { accessKeyId, secretAccessKey, canonicalUserId } } = conf.get("aws") || await configure("aws")

  try {
    const s3Client = new S3Client({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
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
      credentials: { accessKeyId, secretAccessKey }
    })

    const distributionConfig = {
      Aliases: {
        Quantity: 1,
        Items: [bucketName],
      },
      CallerReference: Date.now(),
      Comment: origin,
      DefaultCacheBehavior: {
        Compress: true,
        TargetOriginId: origin,
        ViewerProtocolPolicy: "redirect-to-https",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Enabled: true,
      PriceClass: "PriceClass_100",
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: origin,
            DomainName: origin.replace(
              "s3.amazonaws.com",
              `s3-${DEFAULT_REGION}.amazonaws.com`
            ),
            S3OriginConfig: {
              OriginAccessIdentity:
                "origin-access-identity/cloudfront/EXA6BVZLQ1EY",
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

    writeStep(`Update bucket policy for bucket: ${bucketName}`)

    // Update bucket policy
    const bucketPolicy = {
      Version: "2008-10-17",
      Id: "PolicyForCloudFrontPrivateContent",
      Statement: [
        {
          Sid: "1",
          Effect: "Allow",
          Principal: {
            AWS: "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXA6BVZLQ1EY",
          },
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    )

    await s3Client.send(
      new PutBucketVersioningCommand({
        Bucket: bucketName,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      })
    )

    writeSuccess(`Cloudfront distribution for ${environment} created.`)

    store.set(`${environment}CdnUrl`, distribution.Distribution.DomainName)
  } catch (err) {
    console.error(err)
  }
}

export default setupAWS
