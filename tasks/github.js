const conf = new (require("conf"))();
const chalk = require("chalk");
const { program } = require("commander");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function createRepos() {}

module.exports = createRepos;
