const conf = new (require("conf"))();

function getTrellisPath() {
  let apiName = conf.get("apiName");
  return `${apiName}/trellis`;
}

function getGroupVarsPath(environment) {
  let trellisPath = getTrellisPath();

  return `${trellisPath}/group_vars/${environment}`;
}

module.exports = { getTrellisPath, getGroupVarsPath };
