const { program } = require("commander")
const { getKinstaHelpMessage } = require("../help/kinsta")

program
  .command("kinsta")
  .description("Output Kinsta configuration file template")
  .action(function () {
    console.log(getKinstaHelpMessage())
  })
