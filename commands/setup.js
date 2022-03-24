const chalk = require("chalk");
const conf = new (require("conf"))();
const prompts = require("prompts");

async function setup(service) {
  let services = ["s3", "stackpath"];
  let results = {};

  if (service) {
    if (!services.includes(service)) {
      console.log(
        chalk.red.bold(
          `🚔🚔🚔 The service named ${service} is not available. The available services are: ${services.join(
            ", "
          )}`
        )
      );
      process.exit();
    }

    services = [service];
  }

  services.map((service) => {
    switch (service) {
      case "s3": {
        results["s3"] = s3();
      }
    }
  });

  return results;
}

async function s3() {
  let s3Credentials = await prompts([
    {
      type: "text",
      message: "Enter the S3 access key ID",
      name: "accessKeyId",
    },
    {
      type: "invisible",
      message: "Enter the S3 secret access key (hidden input)",
      name: "secretAccessKey",
    },
  ]);

  conf.set("s3", s3Credentials);
  console.log(chalk.greenBright("🎉 Your S3 credentials was saved."));

  return s3Credentials;
}

module.exports = setup;
