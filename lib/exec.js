import { exec } from "child_process"
import util from "util"

const asyncExec = util.promisify(exec)

export default asyncExec
