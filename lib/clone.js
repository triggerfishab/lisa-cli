import prompts from "prompts"

import conf from "./conf.js"

export async function askForCorrectRepoNames() {
  const apiRepoName = conf.get("apiRepoName")
  const appRepoName = conf.get("appRepoName")

  const { correct } = await prompts({
    type: "confirm",
    name: "correct",
    message: `Please verify the repos:
API: ${apiRepoName}
App: ${appRepoName}

Are these the correct repos that you want to clone?`,
  })

  if (!correct) {
    const { apiRepo, appRepo } = await prompts([
      {
        type: "text",
        name: "apiRepo",
        message:
          "Please enter the git repo for the API (go to the repo, click code, and use the SSH variant)",
      },
      {
        type: "text",
        name: "appRepo",
        message:
          "Please enter the git repo for the app (go to the repo, click code, and use the SSH variant)",
      },
    ])

    conf.set("apiRepoName", apiRepo)
    conf.get("appRepoName", appRepo)
  }
}
