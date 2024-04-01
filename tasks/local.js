import fs from "fs"
import generator from "generate-password"
import yaml from "js-yaml"

import { getApiName, getProjectName } from "../lib/app-name.js"
import exec from "../lib/exec.js"
import { getGroupVarsPath, getTrellisPath } from "../lib/trellis.js"
import { writeStep, writeSuccess } from "../lib/write.js"
import installDependencies from "./dependencies.js"
import { addGithubRepoSecrets } from "./repo.js"
import { addVaultPassword, changeVaultPasswords } from "./trellis.js"
import linkValetSite, { getValetTld } from "./valet.js"

async function setupLocalSiteForDevelopment() {
  writeStep("Setup site for local development")

  await installDependencies()
  await linkValetSite()
  await addVaultPassword()
  await changeVaultPasswords()
  await addGithubRepoSecrets()

  const projectName = await getProjectName()
  const apiName = await getApiName()
  const tld = await getValetTld()
  const trellisPath = getTrellisPath()

  const developmentGroupVarsPath = getGroupVarsPath("development")
  const siteName = `${projectName}.${tld}`
  const apiDomain = `${apiName}.${tld}`

  writeStep("Setup development files")

  try {
    const wordpressSites = yaml.load(
      fs.readFileSync(
        `${developmentGroupVarsPath}/wordpress_sites.yml`,
        "utf8",
      ),
    )

    const config = { ...wordpressSites }

    config.wordpress_sites[siteName] = {
      ...config.wordpress_sites["lisa.test"],
      site_hosts: [
        {
          canonical: apiDomain,
          redirects: [`www.${apiDomain}`],
        },
      ],
      admin_email: `admin@${apiDomain}`,
    }

    delete config.wordpress_sites["lisa.test"]

    fs.writeFile(
      `${developmentGroupVarsPath}/wordpress_sites.yml`,
      yaml.dump(config),
      () =>
        writeSuccess(
          `${developmentGroupVarsPath}/wordpress_sites.yml updated.`,
        ),
    )

    const vaultConfig = {
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
    }

    fs.writeFile(
      `${developmentGroupVarsPath}/vault.yml`,
      yaml.dump(vaultConfig),
      () => writeSuccess(`${developmentGroupVarsPath}/vault.yml updated.`),
    )

    await exec(
      `ansible-vault encrypt ${developmentGroupVarsPath}/vault.yml --vault-password-file ${trellisPath}/.vault_pass`,
    )

    await exec("trellis dotenv", {
      cwd: trellisPath,
    })

    await exec("wp db create", { cwd: `${apiName}/site` })

    writeSuccess(`Local database called "${apiName}" created.`)
  } catch (e) {
    console.log(e)
  }
}

export default setupLocalSiteForDevelopment
