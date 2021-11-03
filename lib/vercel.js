const util = require("util");
const { getAppName } = require("./app-name");
const exec = util.promisify(require("child_process").exec);

async function addSiteToVercel() {
  let appName = getAppName();
  await exec("vercel link", { cwd: appName });
}

module.exports = addSiteToVercel;
