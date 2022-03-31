const { program } = require("commander")
const { writeEnvValueToVault } = require("../lib/vault")

program.command("vault").description("Test vault functions").action(vault)

async function vault() {
  writeEnvValueToVault("test", "13", "staging")
}

module.exports = vault