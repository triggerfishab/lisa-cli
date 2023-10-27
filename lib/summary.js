import chalk from "chalk"
import { exec } from "child_process"
import prompts from "prompts"

import { getAppName } from "./app-name.js"
import conf from "./conf.js"
import { writeInfo, writeStep } from "./write.js"

export async function writeSummary() {
  const apiUrl = conf.get("apiUrl")
  const appName = await getAppName()
  const redirectUrl = `${apiUrl}/wp/wp-admin/tools.php?page=redirection.php`

  writeStep(chalk.underline("Summary:"))
  writeInfo(`API url: ${apiUrl}/wp/wp-admin`)
  writeInfo(
    `To start frontend app, run: ${chalk.bold(
      chalk.underline(`cd ${appName} && yarn dev`),
    )}`,
  )

  writeInfo(
    `Before doing anything else, go to: ${apiUrl}/wp/wp-admin/tools.php?page=redirection.php and complete the installer.`,
  )

  const { confirm } = await prompts([
    {
      type: "confirm",
      name: "confirm",
      message: () => `Do you want to open ${redirectUrl} in your browser now?`,
      initial: false,
    },
  ])

  if (confirm) {
    try {
      exec(`open ${redirectUrl}`)
    } catch (error) {}
  }
}
