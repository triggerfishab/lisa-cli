import conf from "./conf.js"

export function getTrellisPath() {
  let apiName = conf.get("apiName")
  return `${apiName}/trellis`
}

export function getTrellisSitePath() {
  let apiName = conf.get("apiName")
  return `${apiName}/site`
}

export function getGroupVarsPath(environment) {
  let trellisPath = getTrellisPath()

  return `${trellisPath}/group_vars/${environment}`
}
