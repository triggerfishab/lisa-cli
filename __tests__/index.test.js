import { describe, expect, test } from "@jest/globals"
import { program, initProgram } from "../index.js"

describe("Lisa", () => {
  test("Shows help when no input is given", async () => {
    const hold = process.argv
    process.argv = "node script.js user".split(" ")
    program.parse()
    process.argv = hold
    expect(program.args).toEqual(["user"])
  })
  test("when await .parseAsync then returns program", async () => {
    program.action(() => {})

    const result = await program.parseAsync(["node", "test"])
    expect(result).toBe(program)
  })
})
