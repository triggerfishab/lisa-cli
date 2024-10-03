import ip from "ip"
import fetch from "node-fetch"

import { writeError, writeStep } from "./write.js"

const { cidrSubnet } = ip
export async function isTriggerfishOfficeIp() {
  writeStep(
    "Checking if you are in the Triggerfish office (or using the VPN)...",
  )
  const cidr = "155.4.226.178/28"
  const ipCorrect = await fetch("https://icanhazip.com/")
    .then((response) => response.text())
    .then((ip) => cidrSubnet(cidr).contains(ip.trim()))

  if (!ipCorrect) {
    writeError(
      "You are not in the Triggerfish office or using the VPN. This is required for the Sendgrid API call to work.",
    )
    process.exit()
  }
}
