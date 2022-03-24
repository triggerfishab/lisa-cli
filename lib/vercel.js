const util = require("util");
const { getAppName } = require("./app-name");
const { spawnSync } = require("child_process");

async function addSiteToVercel() {
  let appName = await getAppName();

  spawnSync(`vercel link`, [], {
    cwd: appName,
    stdio: "inherit",
    shell: true,
  });
}

module.exports = addSiteToVercel;
