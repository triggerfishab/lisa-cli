const conf = require("./conf");

function getTrellisPath() {
  let apiName = conf.get("apiName");
  return `${apiName}/trellis`;
}

function getTrellisSitePath() {
  let apiName = conf.get("apiName");
  return `${apiName}/site`;
}

function getGroupVarsPath(environment) {
  let trellisPath = getTrellisPath();

  return `${trellisPath}/group_vars/${environment}`;
}

module.exports = { getTrellisPath, getTrellisSitePath, getGroupVarsPath };
