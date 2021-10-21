const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const conf = new (require("conf"))();

async function linkValetSite() {
  console.log();
  console.log(chalk.cyanBright("🪚 Linking site to Valet."));

  let apiName = conf.get("apiName");
  let tld = await exec("valet tld");
  await exec(`valet link --secure ${apiName}`, { cwd: `${apiName}/site` });

  console.log(
    chalk.green(`🎉 Site linked as https://${apiName}.${tld.stdout.trim()}.`)
  );
}

module.exports = linkValetSite;
