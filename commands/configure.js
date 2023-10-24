import conf from "../lib/conf.js"
import { writeError, writeSuccess } from "../lib/write.js"

async function configure(options) {
  const services = ["aws", "godaddy", "sendgrid"]

  if (typeof options.reset !== "undefined" && options.reset) {
    for (const service of services) {
      conf.delete(service)
    }

    writeSuccess("Specified services config has been reset")
    return
  }

  writeError("This command is deprecated. Use --reset to reset the old config.")
}

export default configure
