const { getTrellisSitePath } = require("./trellis");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getAdminUrl() {
  let trellisSitePath = getTrellisSitePath();

  let apiUrl = await exec(`wp option get home`, {
    cwd: `${trellisSitePath}/web/app/themes/lisa`,
  });
  return apiUrl.stdout.trim();
}

module.exports = { getAdminUrl };
