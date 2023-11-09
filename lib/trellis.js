import conf from "./conf.js"

/**
 * @param {('lisa'|'wanda')} projectType - The type of project, either "lisa" or "wanda".
 */
export function getTrellisPath(projectType = "lisa") {
  let projectPath = conf.get("apiName")

  if (projectType === "wanda") {
    projectPath = conf.get("projectName")
  }

  return `${projectPath}/trellis`
}

/**
 * @param {('lisa'|'wanda')} projectType - The type of project, either "lisa" or "wanda".
 */
export function getTrellisSitePath(projectType = "lisa") {
  const apiName = conf.get("apiName")
  let sitePath = `${apiName}/site`

  if (projectType === "wanda") {
    sitePath = conf.get("projectName")
  }
  return sitePath
}

export function getGroupVarsPath(environment) {
  const trellisPath = getTrellisPath()

  return `${trellisPath}/group_vars/${environment}`
}
