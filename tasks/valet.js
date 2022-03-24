const chalk = require("chalk");
const exec = require("../lib/exec");
const conf = new (require("conf"))();

async function linkValetSite() {
  console.log();
  console.log(chalk.cyanBright("🪚 Linking site to Valet."));

  let apiName = conf.get("apiName");
  let tld = await getValetTld();
  await exec(`valet link --secure ${apiName}`, { cwd: `${apiName}/site` });

  console.log(chalk.green(`🎉 Site linked as https://${apiName}.${tld}.`));
}

async function getValetTld() {
  let tld = await exec("valet tld");

  return tld.stdout.trim();
}

const valetModule = (module.exports = linkValetSite);
valetModule.getValetTld = getValetTld;
