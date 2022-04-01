const { program } = require("commander")
const { writeEnvValueToVault } = require("../lib/vault")

program.command("vault").description("Test vault functions").action(vault)

async function vault() {
  writeEnvValueToVault(
    { test: "13", test2: "1337", force_uploads: false },
    "staging"
  )

  writeEnvValueToVault({ data132: "johan" }, "all")
}

module.exports = vault
