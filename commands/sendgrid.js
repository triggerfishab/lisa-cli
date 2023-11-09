import { exec } from "child_process"
import fetch from "node-fetch"
import readline from "readline"

import * as store from "../lib/store.js"
import { writeError, writeInfo, writeStep, writeSuccess } from "../lib/write.js"
import setupSendgridAccount from "../tasks/services/sendgrid.js"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function connectToVPN(vpnName) {
  exec(`networksetup -connectpppoeservice "${vpnName}"`, (error, stderr) => {
    if (error) {
      writeError("Failed to connect to the VPN. Check your VPN configuration.")
      console.error(stderr)
      proceedWithSendGrid()
    } else {
      // Countdown before showing writeSuccess
      let countdown = 3
      const countdownInterval = setInterval(() => {
        console.log(`Connecting in ${countdown} seconds...`)
        countdown--
        if (countdown === 0) {
          clearInterval(countdownInterval)
          writeSuccess("Connected to the VPN!")
          proceedWithSendGrid()
        }
      }, 1000)
    }
  })
}

async function proceedWithSendGrid() {
  writeStep("Creating SendGrid account")

  await setupSendgridAccount()

  const sendgridApiKey = store.get("sendgridApiKey")

  if (sendgridApiKey) {
    writeSuccess("SendGrid account created!")
    writeInfo(`Add the following values to your vault file or .env: 
      tf_smtp_username: "apikey",
      tf_smtp_password: ${sendgridApiKey}
    `)
  } else {
    writeError("No SendGrid account was created.")
  }
}

export async function checkIfUserIsInOffice() {
  writeStep(
    "Checking if you are in the Triggerfish office (or using the VPN)...",
  )

  const ipCorrect = await fetch("https://icanhazip.com/")
    .then((response) => response.text())
    .then((ip) => ip.trim() === "158.174.69.114")

  if (!ipCorrect) {
    // eslint-disable-next-line
    exec('scutil --nc list | grep -o \'"[^"]*"\'', (error, stdout) => {
      if (error) {
        writeError("Failed to list available VPNs.")
        rl.close()
        proceedWithSendGrid()
      } else {
        const availableVPNs = stdout
          .split("\n")
          .filter((vpn) => vpn.trim().length > 0)

        if (availableVPNs.length > 0) {
          writeInfo("Available VPNs:")
          availableVPNs.forEach((vpn, index) => {
            writeInfo(`${index + 1}. ${vpn}`)
          })

          rl.question("Choose a VPN by entering its number: ", (answer) => {
            rl.close()
            const chosenVPN = availableVPNs[parseInt(answer) - 1]
            if (chosenVPN) {
              connectToVPN(chosenVPN)
            } else {
              writeError("Invalid choice.")
            }
          })
        } else {
          writeError("No available VPNs found.")
          rl.close()
          proceedWithSendGrid()
        }
      }
    })
  } else {
    proceedWithSendGrid()
  }
}
