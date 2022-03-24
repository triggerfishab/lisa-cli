const { getAppName, getApiName, getProjectName } = require("./app-name");
const {
  getGroupVarsPath,
  getTrellisPath,
  getTrellisSitePath,
} = require("./trellis");
const fs = require("fs");
const yaml = require("js-yaml");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const generator = require("generate-password");
const chalk = require("chalk");
const { getAdminUrl } = require("./wordpress");
const { spawnSync } = require("child_process");

async function generateSecrets() {
  await getProjectName();

  let appName = await getAppName();
  let apiName = await getApiName();
  let trellisPath = getTrellisPath();
  let trellisSitePath = await getTrellisSitePath();

  let jwtSecret = generator.generate({
    length: 32,
    numbers: true,
  });

  let apiSecret = generator.generate({
    length: 32,
    numbers: true,
  });

  let allGroupVarsPath = getGroupVarsPath("all");

  await exec(`ansible-vault decrypt group_vars/all/vault.yml`, {
    cwd: trellisPath,
  });

  let allVaultFile = yaml.load(
    fs.readFileSync(`${allGroupVarsPath}/vault.yml`, "utf-8")
  );

  allVaultFile.vault_wordpress_env_defaults.graphql_jwt_auth_secret_key =
    jwtSecret;
  allVaultFile.vault_wordpress_env_defaults.next_api_secret = apiSecret;

  fs.writeFile(`${allGroupVarsPath}/vault.yml`, yaml.dump(allVaultFile), () =>
    console.log(
      chalk.greenBright(
        `🎉 ${allGroupVarsPath}/vault.yml updated with new secrets.`
      )
    )
  );

  await exec(`ansible-vault encrypt group_vars/all/vault.yml`, {
    cwd: trellisPath,
  });

  spawnSync(`wp core install --prompt`, [], {
    cwd: `${apiName}/site`,
    stdio: "inherit",
    shell: true,
  });

  let apiUrl = await getAdminUrl();

  await exec(
    `printf ${apiUrl}/wp/graphql | vercel env add NEXT_PUBLIC_API_URL development`,
    { cwd: appName }
  );
  console.log(
    chalk.greenBright(
      `🎉 NEXT_PUBLIC_API_URL environment variable saved to Vercel.`
    )
  );

  await exec(`printf "${apiSecret}" | vercel env add API_SECRET production`, {
    cwd: appName,
  });
  await exec(`printf "${apiSecret}" | vercel env add API_SECRET preview`, {
    cwd: appName,
  });
  await exec(`printf "${apiSecret}" | vercel env add API_SECRET development`, {
    cwd: appName,
  });
  console.log(
    chalk.greenBright(`🎉 API_SECRET environment variable saved to Vercel.`)
  );

  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET production`,
    { cwd: appName }
  );
  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET preview`,
    { cwd: appName }
  );
  await exec(
    `printf "${jwtSecret}" | vercel env add FORGOT_PASSWORD_JWT_SECRET development`,
    { cwd: appName }
  );
  console.log(
    chalk.greenBright(
      `🎉 FORGOT_PASSWORD_JWT_SECRET environment variable saved to Vercel.`
    )
  );

  await exec("trellis dotenv", { cwd: trellisPath });
}

module.exports = { generateSecrets };
