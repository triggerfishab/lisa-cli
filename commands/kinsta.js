import { getKinstaHelpMessage } from "../help/kinsta.js"
import { writeError, writeStep } from "../lib/write.js"
import createKinstaSite from "../tasks/services/kinsta.js"

export async function kinsta(action) {
  let actions = ["create", "show-config"]

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

      case "show-config":
        console.log(getKinstaHelpMessage())
        process.exit()
    }
  }
}
