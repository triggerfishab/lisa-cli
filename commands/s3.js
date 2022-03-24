const { getProjectName } = require("../lib/app-name");
const setup = require("./setup");
const conf = new (require("conf"))();
const exec = require("../lib/exec");

async function setupS3Bucket() {
  let projectName = await getProjectName();

  let s3 = conf.get("s3") || (await setup("s3")).s3;

  process.env.AWS_ACCESS_KEY_ID = s3.accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = s3.secretAccessKey;
  process.env.AWS_DEFAULT_REGION = "eu-north-1";

  exec(`aws s3 mb s3://${projectName}.cdn.triggerfish.cloud`);
}

module.exports = setupS3Bucket;
