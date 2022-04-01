const { program } = require("commander")
const {
  writeEnvDataToVault,
  writeEnvDataToWordPressSites,
} = require("../lib/vault")

program.command("vault").description("Test vault functions").action(vault)

async function vault() {
  // writeEnvDataToVault(
  //   { test: "13", test2: "1337", force_uploads: false },
  //   "staging"
  // )

  // writeEnvDataToVault({ data132: "johan" }, "all")

  writeEnvDataToWordPressSites({ test2: "johan" }, "staging")
}

module.exports = vault
