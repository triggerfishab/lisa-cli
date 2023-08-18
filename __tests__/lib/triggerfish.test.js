import { describe, expect, it, vi } from "vitest"

import fetch from "node-fetch"
import { isTriggerfishOfficeIp } from "../../lib/triggerfish"
import chalk from "chalk"

vi.mock("node-fetch")

describe("isTriggerfishOfficeIp", () => {
  const consoleMock = vi.spyOn(console, "log").mockImplementation(() => {})

  it("should expose a function", () => {
    expect(isTriggerfishOfficeIp).toBeDefined()
  })
  it("isTriggerfishOfficeIp should return expected output when in office or on VPN", async () => {
    fetch.mockResolvedValueOnce({
      text: () => "158.174.69.114",
    })
    await isTriggerfishOfficeIp()
    const message =
      "Checking if you are in the Triggerfish office (or using the VPN)..."
    expect(consoleMock).toHaveBeenCalledWith(`⚡️ ${chalk.green.bold(message)}`)
  })

  it("isTriggerfishOfficeIp should return expected output when not in office or on VPN and process.exit", async () => {
    const processExitMock = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {})

    fetch.mockResolvedValueOnce({
      text: () => "127.0.0.1",
    })

    await isTriggerfishOfficeIp()

    const errorMessage =
      "You are not in the Triggerfish office or using the VPN. This is required for the Sendgrid API call to work."
    expect(consoleMock).toHaveBeenCalledWith(`🚨 ${chalk.red(errorMessage)}`)
    expect(processExitMock).toHaveBeenCalled()
  })
})
