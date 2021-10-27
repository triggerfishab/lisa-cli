const chalk = require("chalk");
const yaml = require("js-yaml");
const fs = require("fs");
const { getLisaVaultPass } = require("../lib/vault-pass");
const { getTrellisPath, getGroupVarsPath } = require("../lib/trellis");
const { getValetTld } = require("../tasks/valet");
const { getProjectName } = require("../lib/app-name");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const generator = require("generate-password");

async function configureTrellisForKinsta({ configFile }) {
  let projectName = await getProjectName();

  console.log();
  console.log(
    chalk.bold.greenBright(
      "⚡️⚡️⚡️ Setup Kinsta configuration files ⚡️⚡️⚡️"
    )
  );

  let lisaVaultPass = await getLisaVaultPass();
  let kinstaConfigFile = yaml.load(fs.readFileSync(configFile, "utf8"));
  let trellisPath = getTrellisPath();
  let ansibleCfgFile = fs.readFileSync(`${trellisPath}/ansible.cfg`, "utf8");
  ansibleCfgFile = ansibleCfgFile.replace(
    "[defaults]",
    "[defaults]\nforks = 3\nhost_key_checking = False"
  );

  fs.writeFileSync(`${trellisPath}/ansible.cfg`, ansibleCfgFile);
  console.log(chalk.greenBright(`🎉 ${trellisPath}/ansible.cfg updated.`));

  let stagingHost = `kinsta_staging ansible_host=${kinstaConfigFile.staging.ansible_host} ansible_ssh_port=${kinstaConfigFile.staging.ansible_ssh_port} ansible_ssh_extra_args='-o StrictHostKeyChecking=no'

[web]
kinsta_staging

[staging]
kinsta_staging`;

  fs.writeFileSync(`${trellisPath}/hosts/staging`, stagingHost);
  console.log(chalk.greenBright(`🎉 ${trellisPath}/hosts/staging updated.`));

  let stagingGroupVarsPath = getGroupVarsPath("staging");

  let stagingWordpressSites = yaml.load(
    fs.readFileSync(`${stagingGroupVarsPath}/wordpress_sites.yml`, "utf-8")
  );

  let { sitename } = kinstaConfigFile;
  let apiDomain = kinstaConfigFile.staging.canonical;

  let config = { ...stagingWordpressSites };
  let repo = await exec(`git config --get remote.origin.url`, {
    cwd: trellisPath,
  });
  repo = repo.stdout.trim();

  config.wordpress_sites[sitename] = {
    ...config.wordpress_sites["lisa.test"],
    site_hosts: [
      {
        canonical: apiDomain,
      },
    ],
    branch: "develop",
    admin_email: `admin@${apiDomain}`,
    repo,
  };

  delete config.wordpress_sites["lisa.test"];

  fs.writeFile(
    `${stagingGroupVarsPath}/wordpress_sites.yml`,
    yaml.dump(config),
    () =>
      console.log(
        chalk.greenBright(
          `🎉 ${stagingGroupVarsPath}/wordpress_sites.yml updated.`
        )
      )
  );

  let main = `project_root: ${kinstaConfigFile.staging.project_root}
www_root: ${kinstaConfigFile.staging.www_root}
web_user: ${kinstaConfigFile.staging.web_user}
web_group: ${kinstaConfigFile.staging.web_group}`;

  fs.writeFile(`${stagingGroupVarsPath}/main.yml`, main, () =>
    console.log(
      chalk.greenBright(`🎉 ${stagingGroupVarsPath}/main.yml updated.`)
    )
  );

  let vaultConfig = {
    vault_wordpress_sites: {
      [sitename]: {
        env: {
          db_name: kinstaConfigFile.staging.db_name,
          db_password: kinstaConfigFile.staging.db_password,
          db_user: kinstaConfigFile.staging.db_user,
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

  fs.writeFileSync(`${stagingGroupVarsPath}/vault.yml`, yaml.dump(vaultConfig));

  await exec(
    `ansible-vault encrypt ${stagingGroupVarsPath}/vault.yml --vault-password-file ${trellisPath}/.vault_pass`
  );

  console.log(
    chalk.greenBright(`🎉 ${stagingGroupVarsPath}/vault.yml updated.`)
  );
}

module.exports = configureTrellisForKinsta;
