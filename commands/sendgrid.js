import * as store from "../lib/store.js"
import { isTriggerfishOfficeIp } from "../lib/triggerfish.js"
import { writeError, writeInfo, writeStep, writeSuccess } from "../lib/write.js"
import setupSendgridAccount from "../tasks/services/sendgrid.js"

export async function createSendGrid() {
  await isTriggerfishOfficeIp()
  writeStep("Creating SendGrid account")

  await setupSendgridAccount()

  let sendgridApiKey = store.get("sendgridApiKey")

  if (sendgridApiKey) {
    writeSuccess("SendGrid account created!")
    writeInfo(`Add the following values to your vault file or .env:
      tf_smtp_username: "apikey",
      tf_smtp_password: ${sendgridApiKey}
  `)
  } else {
    writeError("No Sendgrid account was created.")
  }
}
