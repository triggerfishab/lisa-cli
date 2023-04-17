import { writeError, writeStep } from "./write.js"

export async function isTriggerfishOfficeIp() {
  writeStep(
    "Checking if you are in the Triggerfish office (or using the VPN)..."
  )

  const ip = await fetch("https://icanhazip.com/")
    .then((response) => response.text())
    .then((ip) => ip === "158.174.69.114")

  if (!ip) {
    writeError(
      "You are not in the Triggerfish office or using the VPN. This is required for the Sendgrid API call to work."
    )
    process.exit()
  }
}
