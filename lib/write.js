import chalk from "chalk"

export function writeInfo(message) {
  console.log(`️💁 ${message}`)
}

export function writeWarning(message) {
  console.log(`⚠️ ${chalk.yellow(message)}`)
}

export function writeError(message) {
  console.log(`🚨 ${chalk.red(message)}`)
}

export function writeSuccess(message) {
  console.log(`🎉 ${chalk.green(message)}`)
}

export function writeStep(message) {
  console.log()
  console.log(`⚡️ ${chalk.green.bold(message)}`)
  console.log()
}

export function writeEmptyLine() {
  console.log()
}
