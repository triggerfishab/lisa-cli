import fs from "fs"
import generator from "generate-password"
import yaml from "js-yaml"
import prompts from "prompts"

import { getAppName, getProjectName } from "./app-name.js"
import exec from "./exec.js"
import { getGroupVarsPath, getTrellisPath } from "./trellis.js"
import { writeStep, writeSuccess } from "./write.js"

export async function askForConfigFile() {
  let { configFile } = await prompts({
    type: "text",
    name: "configFile",
    message: "Enter the name of your Kinsta configuration file (relative path)",
  })

  return configFile
}

export async function configureTrellisForKinsta(configFile) {
  if (!configFile) {
    configFile = await askForConfigFile()
  }

  await getProjectName()

  writeStep("Setup Kinsta configuration files")

  let trellisPath = getTrellisPath()
  let ansibleCfgFile = fs.readFileSync(`${trellisPath}/ansible.cfg`, "utf8")
  ansibleCfgFile = ansibleCfgFile.replace(
    "[defaults]",
    "[defaults]\nforks = 3\nhost_key_checking = False",
  )

  fs.writeFileSync(`${trellisPath}/ansible.cfg`, ansibleCfgFile)
  writeSuccess(`${trellisPath}/ansible.cfg updated.`)

  await updateConfigFilesForEnvironment("staging", configFile)
  await updateConfigFilesForEnvironment("production", configFile)
}

export async function updateConfigFilesForEnvironment(environment, configFile) {
  let kinstaConfigFile = yaml.load(fs.readFileSync(configFile, "utf8"))
  let trellisPath = getTrellisPath()
  let appName = await getAppName()
  let host = `kinsta_${environment} ansible_host=${kinstaConfigFile[environment].ansible_host} ansible_ssh_port=${kinstaConfigFile[environment].ansible_ssh_port} ansible_ssh_extra_args='-o StrictHostKeyChecking=no'

[web]
kinsta_${environment}

[${environment}]
kinsta_${environment}`

  fs.writeFileSync(`${trellisPath}/hosts/${environment}`, host)
  writeSuccess(`${trellisPath}/hosts/${environment} updated.`)

  let groupVarsPath = getGroupVarsPath(environment)

  let wordpressSites = yaml.load(
    fs.readFileSync(`${groupVarsPath}/wordpress_sites.yml`, "utf-8"),
  )

  let { sitename } = kinstaConfigFile
  let apiDomain = kinstaConfigFile[environment].canonical

  let config = { ...wordpressSites }
  let repo = await exec(`git config --get remote.origin.url`, {
    cwd: trellisPath,
  })
  repo = repo.stdout.trim()

  let frontend_url = "http://localhost:3000"

  if (environment === "staging") {
    frontend_url = `https://develop-${appName}.vercel.app`
  }

  if (environment === "production") {
    frontend_url = `https://${appName}.vercel.app`
  }

  config.wordpress_sites[sitename] = {
    ...config.wordpress_sites["lisa.test"],
    site_hosts: [
      {
        canonical: apiDomain,
      },
    ],
    env: {
      ...config.wordpress_sites["lisa.test"].env,
      frontend_url,
    },
    branch: environment === "production" ? "main" : "develop",
    admin_email: `admin@${apiDomain}`,
    repo,
  }

  if (kinstaConfigFile[environment].redirects) {
    config.wordpress_sites[sitename].site_hosts[0].redirects =
      kinstaConfigFile[environment].redirects
  }

  delete config.wordpress_sites["lisa.test"]

  fs.writeFile(`${groupVarsPath}/wordpress_sites.yml`, yaml.dump(config), () =>
    writeSuccess(`${groupVarsPath}/wordpress_sites.yml updated.`),
  )

  let main = `project_root: ${kinstaConfigFile[environment].project_root}
www_root: ${kinstaConfigFile[environment].www_root}
web_user: ${kinstaConfigFile[environment].web_user}
web_group: ${kinstaConfigFile[environment].web_group}`

  fs.writeFile(`${groupVarsPath}/main.yml`, main, () =>
    writeSuccess(`${groupVarsPath}/main.yml updated.`),
  )

  let vaultConfig = {
    vault_wordpress_sites: {
      [sitename]: {
        env: {
          db_name: kinstaConfigFile[environment].db_name,
          db_password: kinstaConfigFile[environment].db_password,
          db_user: kinstaConfigFile[environment].db_user,
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
  }

  fs.writeFileSync(`${groupVarsPath}/vault.yml`, yaml.dump(vaultConfig))

  await exec(
    `ansible-vault encrypt ${groupVarsPath}/vault.yml --vault-password-file ${trellisPath}/.vault_pass`,
  )

  writeSuccess(`${groupVarsPath}/vault.yml updated.`)
}
