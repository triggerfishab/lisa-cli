import chalk from "chalk"
import { Command } from "commander"
import { createCdnS3GoDaddy } from "../commands/cdnS3GoDaddy.js"
import cloneLisaProject from "../commands/clone.js"
import configure from "../commands/configure.js"
import dbImport from "../commands/db.js"
import init from "../commands/init.js"
import { createPageComponent } from "../commands/pageComponent.js"
import setupPath from "../commands/path.js"
import { createSendGrid } from "../commands/sendgrid.js"
import writeLisaStatusSummary from "../commands/status.js"
import { resetConf } from "../lib/conf.js"
import { checkDependencies, checkNodeVersion } from "../lib/dependencies.js"
import exec from "../lib/exec.js"
import { getSitesPath } from "../lib/path.js"
import { set } from "../lib/store.js"
import { checkLisaVersion } from "../lib/versions.js"
import { kinsta } from "../commands/kinsta.js"
import { initProgram } from "../index"
import { describe, expect, it, vi } from "vitest"

describe("initProgram", () => {
  it("should expose a function", () => {
    expect(initProgram).toBeDefined()
  })

  it("initProgram should return expected output", async () => {
    const processExitMock = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {})

    await initProgram()

    expect(processExitMock).toHaveBeenCalled()
  })
})
