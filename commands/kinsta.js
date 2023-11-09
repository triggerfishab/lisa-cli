import { getKinstaHelpMessage } from "../help/kinsta.js"
import { writeError, writeStep } from "../lib/write.js"
import createKinstaSite, {
  checkKinstaOperationStatusById,
  cloneKinstaSite,
  getKinstaSiteByProjectName,
  listKinstaSites,
} from "../tasks/services/kinsta.js"

export async function kinsta(action, projectName = "", operationId = "") {
  let actions = ["create", "clone", "show-config", "sites", "site"]

  if (action) {
    if (!actions.includes(action)) {
      writeError(
        `The action named ${action} is not available. The available actions are: ${actions.join(
          ", ",
        )}`,
      )
      process.exit()
    }

    actions = [action]
  }

  for (const action of actions) {
    switch (action) {
      case "create":
        writeStep("Creating Kinsta site!")

        await createKinstaSite()
        break

      case "clone":
        writeStep("Creating Kinsta site by clone!")

        await cloneKinstaSite()
        break
      case "sites":
        writeStep("Listing Kinsta sites!")

        await listKinstaSites()
        break
      case "site":
        if (!projectName) {
          writeError("Please provide a project name!")
          process.exit()
        }
        writeStep("Trying to find Kinsta site!")

        await getKinstaSiteByProjectName(projectName)
        break
      case "operations":
        if (!operationId) {
          writeError("Please provide an operation id!")
          process.exit()
        }

        await checkKinstaOperationStatusById(operationId)
        break
      case "show-config":
        console.log(getKinstaHelpMessage())
        process.exit()
    }
  }
}
