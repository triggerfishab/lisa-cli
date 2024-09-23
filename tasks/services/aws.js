import {
  CloudFrontClient,
  CreateDistributionWithTagsCommand,
  GetDistributionConfigCommand,
  ListDistributionsCommand,
  UpdateCloudFrontOriginAccessIdentityCommand,
  UpdateDistributionCommand,
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
  GetBucketLocationCommand,
  PutBucketLifecycleConfigurationCommand,
  PutBucketPolicyCommand,
  PutBucketTaggingCommand,
  PutBucketVersioningCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from "@aws-sdk/client-s3"

import { getProjectName } from "../../lib/app-name.js"
import exec from "../../lib/exec.js"
import * as store from "../../lib/store.js"
import {
  writeError,
  writeStep,
  writeSuccess,
  writeWarning,
} from "../../lib/write.js"

const DEFAULT_REGION = "eu-north-1"

export async function setupAWS(environment = "production") {
  const projectName = await getProjectName()
  const fullProjectName = `${projectName}.cdn.triggerfish.cloud`
  const bucketName = `${
    environment === "staging" ? "staging-" : ""
  }${fullProjectName}`

  await createIAMUserIfNotExists(fullProjectName)

  const [accessKeyId, secretAccessKey, canonicalUserId] = await getAWSKeys()

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

    await putBucketPublicAccessBlock(bucketName)
    await putBucketLifeCycleRule(bucketName)
    await putBucketTags(bucketName)

    writeSuccess(`S3 bucket for ${environment} created.`)

    const s3BucketUrl = `https://s3.${DEFAULT_REGION}.amazonaws.com/${bucketName}`

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
      HttpVersion: "http2and3",
    }

    const command = new CreateDistributionWithTagsCommand({
      DistributionConfigWithTags: {
        DistributionConfig: distributionConfig,
        Tags: {
          Items: getTags(bucketName),
        },
      },
    })

    const distribution = await cloudFrontClient.send(command)

    writeStep(`Update bucket policy for bucket: ${bucketName}`)

    await putBucketPolicy(bucketName)

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
    writeError(err)
  }
}

async function putBucketPolicy(bucketName) {
  try {
    const [accessKeyId, secretAccessKey, canonicalUserId] = await getAWSKeys()

    const bucketRegion = await getBucketRegion(bucketName)
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

    const s3Client = new S3Client({
      region: bucketRegion,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      }),
    )
    writeSuccess(`Bucket policy for ${bucketName} created.`)
  } catch (error) {}
}

async function createIAMUserIfNotExists(fullProjectName) {
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
  await iamClient.send(new CreateUserCommand({ UserName: fullProjectName }))

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
            Action: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:PutObjectAcl",
              "s3:PutObjectVersionAcl",
            ],
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

    store.set("awsAccessKeyId", accessKeyResponse.AccessKey.AccessKeyId)
    store.set("awsSecretAccessKey", accessKeyResponse.AccessKey.SecretAccessKey)

    await saveAccessKey(
      accessKeyResponse.AccessKey.AccessKeyId,
      accessKeyResponse.AccessKey.SecretAccessKey,
      fullProjectName,
    )
    writeSuccess(
      `1password item for ${fullProjectName} created in the AWS vault.`,
    )
  } catch (error) {
    writeError(error)
  }
}

async function putBucketLifeCycleRule(bucketName) {
  try {
    const [accessKeyId, secretAccessKey, canonicalUserId, accountId] =
      await getAWSKeys()

    const bucketRegion = await getBucketRegion(bucketName)

    const s3Client = new S3Client({
      region: bucketRegion,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })

    // Break out to a function
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

    writeSuccess(`Lifecycle rule for ${bucketName} created.`)
  } catch (error) {
    writeError(error)
  }
}

function getTags(bucketName) {
  return [
    {
      Key: "cdn.triggerfish.cloud",
      Value: bucketName.replace(".cdn.triggerfish.cloud", ""),
    },
  ]
}

async function putBucketPublicAccessBlock(bucketName) {
  try {
    const [accessKeyId, secretAccessKey, canonicalUserId, accountId] =
      await getAWSKeys()

    const bucketRegion = await getBucketRegion(bucketName)

    const s3Client = new S3Client({
      region: bucketRegion,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })
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
    writeSuccess(`Public access rule for ${bucketName} created.`)
  } catch (error) {
    writeError(`${bucketName}: ${error}`)
  }
}

async function putBucketTags(bucketName) {
  try {
    const [accessKeyId, secretAccessKey, canonicalUserId, accountId] =
      await getAWSKeys()

    const bucketRegion = await getBucketRegion(bucketName)

    const s3Client = new S3Client({
      region: bucketRegion,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })

    await s3Client.send(
      new PutBucketTaggingCommand({
        Bucket: bucketName,
        ExpectedBucketOwner: accountId,
        Tagging: {
          TagSet: getTags(bucketName),
        },
      }),
    )
  } catch (error) {
    writeError(`${bucketName}: ${error}`)
  }
}

async function getBucketRegion(bucketName) {
  try {
    const [accessKeyId, secretAccessKey, canonicalUserId, accountId] =
      await getAWSKeys()
    const s3Client = new S3Client({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
      canonicalUserId,
    })
    const bucketLocation = await s3Client.send(
      new GetBucketLocationCommand({
        Bucket: bucketName,
        ExpectedBucketOwner: accountId,
      }),
    )

    return bucketLocation.LocationConstraint
  } catch (error) {
    writeError(error)
    process.exit(1)
  }
}

async function saveAccessKey(accessKeyId, secretAccessKey, fullProjectName) {
  try {
    return await exec(
      `op item create --category login --title ${fullProjectName} 'username=${accessKeyId}' 'secretAccessKey=${secretAccessKey}' --vault g5rjl6vo44f3fnucye7zonybs4`,
    )
  } catch (error) {
    writeError(`Failed saving access keys to 1Password. \n ${error}`)
    process.exit(1)
  }
}

async function getAWSKeys() {
  try {
    return await exec(
      "op item get l2i57yslyjfr5jsieew4imwxgq --fields label='aws.access key id',label='aws.secret access key',label='aws.canonical user id',label='aws.account id'",
    ).then((res) => res.stdout.trim().split(","))
  } catch (error) {
    writeError(`Failed accessing 1Password. \n ${error}`)
    process.exit(1)
  }
}

async function UpdateCloudFrontOriginAccessIdentity(distributionId) {
  const [accessKeyId, secretAccessKey] = await getAWSKeys()

  const cloudFrontClient = new CloudFrontClient({
    region: DEFAULT_REGION,
    credentials: { accessKeyId, secretAccessKey },
  })

  await cloudFrontClient.send(
    new UpdateCloudFrontOriginAccessIdentityCommand({
      CloudFrontOriginAccessIdentityConfig: {
        CallerReference: Date.now(),
        Comment: "Triggerfish CDN",
      },
      Id: distributionId,
      IfMatch: "EXA6BVZLQ1EY",
    }),
  )
}

async function findDistibutionForBucket(bucketName, distributions) {
  return (
    distributions.find((distribution) => distribution.cname === bucketName) ??
    false
  )
}

async function listCloudFrontDistributions() {
  const [accessKeyId, secretAccessKey] = await getAWSKeys()

  const cloudFrontClient = new CloudFrontClient({
    region: DEFAULT_REGION,
    credentials: { accessKeyId, secretAccessKey },
  })

  let Marker = ""
  let isTruncated = false

  const distributions = []

  try {
    do {
      const list = await cloudFrontClient.send(
        new ListDistributionsCommand({
          Marker,
        }),
      )

      Marker = list.DistributionList.NextMarker
      isTruncated = list.DistributionList.IsTruncated

      list.DistributionList.Items.forEach((item) => {
        distributions.push({
          id: item.Id,
          cname: item.AliasICPRecordals?.[0].CNAME,
        })
      })
    } while (isTruncated)
  } catch (error) {
    writeError(error)
  }

  return distributions
}

async function getDistributionConfig(distributionId) {
  const [accessKeyId, secretAccessKey] = await getAWSKeys()

  try {
    const cloudFrontClient = new CloudFrontClient({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
    })

    return await cloudFrontClient.send(
      new GetDistributionConfigCommand({
        Id: distributionId,
      }),
    )
  } catch (error) {
    writeError(error)
  }
}

async function updateDistributionConfig(distributionId, eTag, config) {
  try {
    const [accessKeyId, secretAccessKey] = await getAWSKeys()

    const cloudFrontClient = new CloudFrontClient({
      region: DEFAULT_REGION,
      credentials: { accessKeyId, secretAccessKey },
    })

    await cloudFrontClient.send(
      new UpdateDistributionCommand({
        Id: distributionId,
        IfMatch: eTag,
        DistributionConfig: config,
      }),
    )
    writeSuccess("Distribution config updated!")
  } catch (error) {
    writeError(error)
    process.exit(1)
  }
}

async function getAndUpdateDistributionConfig(distributionId) {
  const { ETag: eTag, DistributionConfig: currentConfig } =
    await getDistributionConfig(distributionId)

  const originConfig = currentConfig.Origins.Items[0]
  originConfig.S3OriginConfig.OriginAccessIdentity =
    "origin-access-identity/cloudfront/EXA6BVZLQ1EY"

  const config = {
    ...currentConfig,
    Origins: { Quantity: 1, Items: [originConfig] },
  }

  await updateDistributionConfig(distributionId, eTag, config)
}

export {
  createIAMUserIfNotExists,
  findDistibutionForBucket,
  getAndUpdateDistributionConfig,
  listCloudFrontDistributions,
  putBucketLifeCycleRule,
  putBucketPublicAccessBlock,
  putBucketPolicy,
  UpdateCloudFrontOriginAccessIdentity,
}

export default setupAWS
