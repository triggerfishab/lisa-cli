const chalk = require("chalk");
const { getProjectName } = require("../lib/app-name");
const yaml = require("js-yaml");
const fs = require("fs");
const { getValetTld } = require("../tasks/valet");
const { getLisaVaultPass } = require("../lib/vault-pass");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const conf = new (require("conf"))();
const generator = require("generate-password");

async function setupTrellisDevelopmentFiles() {
  let projectName = await getProjectName();
  let tld = await getValetTld();

  let apiName = conf.get("apiName");
  let trellisPath = `${apiName}/trellis`;
  let path = `${trellisPath}/group_vars/development`;
  let siteName = `${projectName}.${tld}`;
  let apiDomain = `${apiName}.${tld}`;
  let lisaVaultPass = await getLisaVaultPass();

  console.log();
  console.log(
    chalk.bold.greenBright("⚡️⚡️⚡️ Setup development files ⚡️⚡️⚡️")
  );

  try {
    let wordpressSites = yaml.load(
      fs.readFileSync(`${path}/wordpress_sites.yml`, "utf8")
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

    fs.writeFile(`${path}/wordpress_sites.yml`, yaml.dump(config), () =>
      console.log(chalk.greenBright(`🎉 ${path}/wordpress_sites.yml updated.`))
    );

    // let lisaVaultPassFile = `${path}/.lisa_vault_pass`;

    // fs.writeFile(lisaVaultPassFile, lisaVaultPass, () => {});

    // await exec(
    //   `ansible-vault decrypt ${path}/vault.yml --vault-password-file ${lisaVaultPassFile}`
    // );

    // let vault = yaml.load(fs.readFileSync(`${path}/vault.yml`, "utf8"));

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

    fs.writeFile(`${path}/vault.yml`, yaml.dump(vaultConfig), () =>
      console.log(chalk.greenBright(`🎉 ${path}/vault.yml updated.`))
    );

    await exec(
      `ansible-vault encrypt ${path}/vault.yml --vault-password-file ${trellisPath}/.vault_pass`
    );

    // fs.unlink(lisaVaultPassFile, () => {});

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

module.exports = setupTrellisDevelopmentFiles;
