import { describe, expect, test } from "@jest/globals"
import { checkLisaVersion } from "../../lib/versions.js"

describe("versions module", () => {
  test("it keeps on running cause the data is undefined", async () => {
    await expect(checkLisaVersion()).resolves.toBe(undefined)
  })
})
