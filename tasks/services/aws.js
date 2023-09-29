import {
  CloudFrontClient,
  CreateDistributionCommand,
} from "@aws-sdk/client-cloudfront"
import {
  CreateAccessKeyCommand,
  CreateUserCommand,
  GetUserCommand,
  IAMClient,
  PutUserPolicyCommand,
} from "@aws-sdk/client-iam"
import {
  CreateBucketCommand,
  PutBucketLifecycleConfigurationCommand,
  PutBucketPolicyCommand,
  PutBucketVersioningCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from "@aws-sdk/client-s3"

import { getProjectName } from "../../lib/app-name.js"
import exec from "../../lib/exec.js"
import * as store from "../../lib/store.js"
import { writeStep, writeSuccess, writeWarning } from "../../lib/write.js"

const DEFAULT_REGION = "eu-north-1"

async function setupAWS(environment = "production") {
  const projectName = await getProjectName()
  const fullProjectName = `${projectName}.cdn.triggerfish.cloud`
  const bucketName = `${
    environment === "staging" ? "staging-" : ""
  }${fullProjectName}`

  await createIAMUserIfNotExists(fullProjectName)

  const [accessKeyId, secretAccessKey, canonicalUserId, accountId] =
    await getAWSKeys()

  try {
    writeStep(`Setting up S3 bucket for ${environment} environment`)
    const s3Client = new S3Client({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })

    const bucket = await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
        ObjectOwnership: "BucketOwnerPreferred",
      }),
    )

    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        ExpectedBucketOwner: accountId,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        },
      }),
    )

    await s3Client.send(
      new PutBucketLifecycleConfigurationCommand({
        Bucket: bucketName,
        ExpectedBucketOwner: accountId,
        LifecycleConfiguration: {
          Rules: [
            {
              Expiration: { ExpiredObjectDeleteMarker: true },
              ID: "TF default lifecycle rule",
              Status: "Enabled",
              NoncurrentVersionExpiration: { NoncurrentDays: 1 },
              AbortIncompleteMultipartUpload: { DaysAfterInitiation: 30 },
              Filter: { Prefix: "" },
            },
          ],
        },
      }),
    )

    writeSuccess(`S3 bucket for ${environment} created.`)

    let s3BucketUrl = `https://s3.${DEFAULT_REGION}.amazonaws.com/${bucketName}`

    store.set(`s3Bucket-${environment}`, bucketName)
    store.set(`s3BucketUrl-${environment}`, s3BucketUrl)

    let origin = bucket.Location.replace("http://", "")
    origin = origin.replace("/", "")

    const cloudFrontClient = new CloudFrontClient({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
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
              `s3-${DEFAULT_REGION}.amazonaws.com`,
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
          "arn:aws:acm:us-east-1:928011160524:certificate/7383b293-d589-4171-86d6-af3d808003c3",
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
      }),
    )

    await s3Client.send(
      new PutBucketVersioningCommand({
        Bucket: bucketName,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      }),
    )

    writeSuccess(`Cloudfront distribution for ${environment} created.`)

    store.set(`${environment}CdnUrl`, distribution.Distribution.DomainName)
  } catch (err) {
    console.error(err)
  }
}

export async function createIAMUserIfNotExists(fullProjectName) {
  const [accessKeyId, secretAccessKey] = await getAWSKeys()

  const iamClient = new IAMClient({
    region: DEFAULT_REGION,
    credentials: { accessKeyId, secretAccessKey },
  })

  // Check if user exists
  try {
    await iamClient.send(new GetUserCommand({ UserName: fullProjectName }))
    writeWarning(
      ` IAM user already exists for: ${fullProjectName}. Have a look in 1Password or ask your tech lead for assistance.`,
    )
    return
  } catch (err) {
    // Do nothing, just catch the NoSuchEntityException
  }

  writeStep(` Creating IAM user for ${fullProjectName}`)
  // Create user
  const user = await iamClient.send(
    new CreateUserCommand({ UserName: fullProjectName }),
  )

  // Create inline policy
  await iamClient.send(
    new PutUserPolicyCommand({
      UserName: fullProjectName,
      PolicyName: `${fullProjectName}-policy`,
      PolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["s3:ListBucket", "s3:GetBucketLocation"],
            Resource: `arn:aws:s3:::*${fullProjectName}`,
          },
          {
            Effect: "Allow",
            Action: ["s3:*Object", "s3:PutObjectAcl", "s3:PutObjectVersionAcl"],
            Resource: `arn:aws:s3:::*${fullProjectName}/*`,
          },
        ],
      }),
    }),
  )

  // Create access key
  try {
    const accessKeyResponse = await iamClient.send(
      new CreateAccessKeyCommand({ UserName: fullProjectName }),
    )

    await saveAccessKey(
      accessKeyResponse.AccessKey.AccessKeyId,
      accessKeyResponse.AccessKey.SecretAccessKey,
      fullProjectName,
    )
  } catch (err) {
    console.error(err)
  }
}

async function saveAccessKey(accessKeyId, secretAccessKey, fullProjectName) {
  return await exec(
    `op item create --category login --title ${fullProjectName} 'username=${accessKeyId}' 'secretAccessKey=${secretAccessKey}' --vault g5rjl6vo44f3fnucye7zonybs4`,
  )
}

async function getAWSKeys() {
  return await exec(
    `op item get l2i57yslyjfr5jsieew4imwxgq --fields label="aws.access key id",label="aws.secret access key",label="aws.canonical user id",label="aws.account id"`,
  ).then((res) => res.stdout.trim().split(","))
}

export default setupAWS
