import { writeInfo, writeStep, writeSuccess } from "../lib/write.js"
import { createGoDaddyDnsRecord } from "../tasks/services/godaddy.js"
import prompts from "prompts"
import { isIP } from "net"

export async function createGoDaddy() {
  let previousGlobal = ""
  const recordData = await prompts([
    {
      type: "select",
      name: "type",
      message: "Select record type",
      instructions: "",
      choices: [
        { title: "A", value: "a", selected: false },
        { title: "CNAME", value: "cname", selected: false },
      ],
      hint: "- Space to select. Return to submit",
      min: 1,
    },
    {
      type: "text",
      name: "key",
      message: (prev) => {
        previousGlobal = prev
        return "Enter record name"
      },
      validate: (value) =>
        /^[a-z0-9-\.]+$/.test(value)
          ? true
          : "Please use lowercase, periods and hyphens only",
    },
    {
      type: "text",
      name: "data",
      message: "Enter record data",
      validate: (value) => {
        if (previousGlobal === "cname") {
          return /^[a-z0-9-\.]+$/.test(value)
            ? true
            : "Please use lowercase, periods and hyphens only"
        } else {
          return isIP(value) ? true : "Please enter a valid IP address"
        }
      },
    },
  ])

  await createGoDaddyDnsRecord()
}
