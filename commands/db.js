import fs from "fs"
import prompts from "prompts"
import { getProjectName } from "../lib/app-name.js"
import exec from "../lib/exec.js"
import { getTrellisPath, getTrellisSitePath } from "../lib/trellis.js"
import { writeInfo, writeSuccess } from "../lib/write.js"

async function dbImport() {
  await getProjectName()

  let trellisPath = getTrellisPath()

  let { environment } = await prompts({
    type: "select",
    name: "environment",
    choices: [
      { title: "Staging", value: "staging" },
      { title: "Production", value: "production" },
    ],
    message: "From which environment do you want to import the database?",
  })

  let hostFile = fs.readFileSync(`${trellisPath}/hosts/${environment}`, "utf-8")

  let mainFile = fs.readFileSync(
    `${trellisPath}/group_vars/${environment}/main.yml`,
    "utf-8"
  )

  let host = hostFile.match(/ansible_host=([^\s]+)/)[1]
  let port = hostFile.match(/ansible_ssh_port=([^\s]+)/)[1]
  let user = mainFile.match(/web_user: ([^\s]+)/)[1]
  let docroot = mainFile.match(/www_root: ([^\s]+)/)[1]

  writeInfo(`Making database dump on ${environment}...`)

  await exec(
    `ssh ${user}@${host} -p ${port} 'wp db export --path="${docroot}/current/web/wp" ~/db.sql'`
  )

  writeSuccess(`Database dump on ${environment} successful created!`)

  writeInfo(`Downloading database dump from ${environment}...`)

  await exec(`scp -P ${port} ${user}@${host}:~/db.sql .`)

  writeSuccess(`Database dump from ${environment} successful downloaded!`)

  writeInfo("Importing database to local site...")

  await exec(`wp db import db.sql --path="${getTrellisSitePath()}/web/wp"`)

  writeSuccess("Database successfully imported!")
}

export default dbImport
