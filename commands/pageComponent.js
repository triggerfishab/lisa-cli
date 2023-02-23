import { writeStep } from "../lib/write.js"
import prompts from "prompts"
import { get } from "../lib/store.js"
import { existsSync, mkdirSync, cpSync } from "fs"
import exec from "../lib/exec.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename))

export async function createPageComponent() {
  writeStep("Creating a new page component")
  const initialPath = get("initialPath")
  let targetPath

  process.chdir(initialPath)
  let gitRoot = await exec("git rev-parse --show-toplevel")
  gitRoot = gitRoot.stdout.trim()

  process.chdir(gitRoot)

  let { name } = await prompts([
    {
      type: "text",
      name: "name",
      message:
        "What will your new component be called? Use camelCase for the name.",
      validate: async (name) => {
        targetPath = `${gitRoot}/components/pageComponents/${name}`
        if (existsSync(targetPath)) {
          return "Component already exists, please try another name."
        }
        return true
      },
    },
  ])

  let camelCaseName = name[0].toUpperCase() + name.substring(1)

  mkdirSync(targetPath)

  cpSync(
    `${__dirname}/templates/pageComponents/query.ts`,
    `${targetPath}/query.ts`
  )
  cpSync(
    `${__dirname}/templates/pageComponents/index.tsx`,
    `${targetPath}/index.tsx`
  )
  cpSync(
    `${__dirname}/templates/pageComponents/types.ts`,
    `${targetPath}/types.ts`
  )
  cpSync(
    `${__dirname}/templates/pageComponents/componentName.tsx`,
    `${targetPath}/${name}.tsx`
  )

  exec(
    `sed -i '' 's/COMPONENTNAME/${camelCaseName}/g' ${targetPath}/${name}.tsx`
  )
  exec(`sed -i '' 's/COMPONENTNAME/${camelCaseName}/g' ${targetPath}/query.ts`)
  exec(`sed -i '' 's/COMPONENTNAME/${camelCaseName}/g' ${targetPath}/types.ts`)
  exec(`sed -i '' 's/COMPONENTNAME/${camelCaseName}/g' ${targetPath}/index.tsx`)
  exec(`sed -i '' 's/componentName/${name}/g' ${targetPath}/index.tsx`)

  // add component to fragments.ts
  // add import to pageComponents/index.tsx
  // add type to types/graphql/pageComponents.ts
}
