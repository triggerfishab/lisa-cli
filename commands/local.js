const chalk = require("chalk");
const { getProjectName, getApiName } = require("../lib/app-name");
const yaml = require("js-yaml");
const fs = require("fs");
const { getValetTld } = require("../tasks/valet");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const generator = require("generate-password");
const { getTrellisPath, getGroupVarsPath } = require("../lib/trellis");
const { changeVaultPasswords, addVaultPassword } = require("../tasks/trellis");
const {
  installApiDependencies,
  installAppDependencies,
} = require("../tasks/dependencies");
const linkValetSite = require("../tasks/valet");
const installDependencies = require("../tasks/dependencies");

async function setupLocalSiteForDevelopment() {
  console.log();
  console.log(
    chalk.bold.greenBright(
      "⚡️⚡️⚡️ Setup site for local development ⚡️⚡️⚡️"
    )
  );
  console.log();

  await installDependencies();
  await linkValetSite();
  await addVaultPassword();
  await changeVaultPasswords();

  let projectName = await getProjectName();
  let apiName = await getApiName();
  let tld = await getValetTld();
  let trellisPath = getTrellisPath();

  let developmentGroupVarsPath = getGroupVarsPath("development");
  let siteName = `${projectName}.${tld}`;
  let apiDomain = `${apiName}.${tld}`;

  console.log();
  console.log(
    chalk.bold.greenBright("⚡️⚡️⚡️ Setup development files ⚡️⚡️⚡️")
  );

  try {
    let wordpressSites = yaml.load(
      fs.readFileSync(`${developmentGroupVarsPath}/wordpress_sites.yml`, "utf8")
    );

    let config = { ...wordpressSites };

    config.wordpress_sites[siteName] = {
      ...config.wordpress_sites["lisa.test"],
      site_hosts: [
        {
          canonical: apiDomain,
          redirects: [`www.${apiDomain}`],
        },
      ],
      admin_email: `admin@${apiDomain}`,
    };

    delete config.wordpress_sites["lisa.test"];

    fs.writeFile(
      `${developmentGroupVarsPath}/wordpress_sites.yml`,
      yaml.dump(config),
      () =>
        console.log(
          chalk.greenBright(
            `🎉 ${developmentGroupVarsPath}/wordpress_sites.yml updated.`
          )
        )
    );

    let vaultConfig = {
      vault_wordpress_sites: {
        [siteName]: {
          env: {
            db_name: projectName,
            db_password: "",
            db_user: "root",
            auth_key: generator.generate({
              length: 64,
              numbers: true,
            }),
            secure_auth_key: generator.generate({
              length: 64,
              numbers: true,
            }),
            logged_in_key: generator.generate({
              length: 64,
              numbers: true,
            }),
            nonce_key: generator.generate({
              length: 64,
              numbers: true,
            }),
            auth_salt: generator.generate({
              length: 64,
              numbers: true,
            }),
            secure_auth_salt: generator.generate({
              length: 64,
              numbers: true,
            }),
            logged_in_salt: generator.generate({
              length: 64,
              numbers: true,
            }),
            nonce_salt: generator.generate({
              length: 64,
              numbers: true,
            }),
          },
        },
      },
    };

    fs.writeFile(
      `${developmentGroupVarsPath}/vault.yml`,
      yaml.dump(vaultConfig),
      () =>
        console.log(
          chalk.greenBright(`🎉 ${developmentGroupVarsPath}/vault.yml updated.`)
        )
    );

    await exec(
      `ansible-vault encrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${trellisPath}/.vault_pass`
    );

    await exec(`trellis dotenv`, {
      cwd: trellisPath,
    });

    await exec(`wp db create`, { cwd: `${apiName}/site` });

    console.log(
      chalk.greenBright(`🎉 Local database called "${apiName}" created.`)
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = setupLocalSiteForDevelopment;
