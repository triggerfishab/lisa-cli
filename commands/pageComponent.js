import chalk from "chalk"
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import prompts from "prompts"
import { fileURLToPath } from "url"

import { getApiName, getAppName, getProjectName } from "../lib/app-name.js"
import exec from "../lib/exec.js"
import { getSitesPath } from "../lib/path.js"
import { writeInfo, writeStep, writeSuccess } from "../lib/write.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename))

export async function createPageComponent() {
  await getProjectName()

  const appName = await getAppName()
  const apiName = await getApiName()
  const sitesPath = await getSitesPath()

  process.chdir(`${sitesPath}/${appName}`)

  writeStep("Creating a new page component")

  let targetPath
  let storybookPath
  let gitRoot = await exec("git rev-parse --show-toplevel")
  gitRoot = gitRoot.stdout.trim()

  process.chdir(gitRoot)

  let { name, label } = await prompts([
    {
      type: "text",
      name: "name",
      message:
        "What will your new component be called? Use camelCase for the name.",
      validate: async (name) => {
        targetPath = `${gitRoot}/components/pageComponents/${name}`
        storybookPath = `${gitRoot}/stories/pageComponents`
        if (existsSync(targetPath)) {
          return "Component already exists, please try another name."
        }
        if (existsSync(`${storybookPath}/${name}.stories.tsx`)) {
          return "Story already exists, please try another name."
        }
        return true
      },
    },
    {
      type: "text",
      name: "label",
      message:
        "Please provide a title for your component, it will be used in the admin.",
    },
  ])

  let pascalCaseName = name[0].toUpperCase() + name.substring(1)

  mkdirSync(targetPath)

  cpSync(
    `${__dirname}/templates/pageComponents/query.ts`,
    `${targetPath}/query.ts`,
  )
  cpSync(
    `${__dirname}/templates/pageComponents/index.tsx`,
    `${targetPath}/index.tsx`,
  )
  cpSync(
    `${__dirname}/templates/pageComponents/types.ts`,
    `${targetPath}/types.ts`,
  )
  cpSync(
    `${__dirname}/templates/pageComponents/componentName.tsx`,
    `${targetPath}/${name}.tsx`,
  )
  cpSync(
    `${__dirname}/templates/pageComponents/componentName.stories.tsx`,
    `${storybookPath}/${name}.stories.tsx`,
  )

  writeInfo(`${targetPath}/query.ts created.`)
  writeInfo(`${targetPath}/index.tsx created.`)
  writeInfo(`${targetPath}/types.ts created.`)
  writeInfo(`${targetPath}/${name}.tsx created.`)
  writeInfo(`${storybookPath}/${name}.stories.tsx created.`)

  exec(
    `sed -i '' 's/COMPONENTNAME/${pascalCaseName}/g' ${targetPath}/${name}.tsx`,
  )
  exec(`sed -i '' 's/COMPONENTNAME/${pascalCaseName}/g' ${targetPath}/query.ts`)
  exec(`sed -i '' 's/COMPONENTNAME/${pascalCaseName}/g' ${targetPath}/types.ts`)
  exec(
    `sed -i '' 's/COMPONENTNAME/${pascalCaseName}/g' ${targetPath}/index.tsx`,
  )
  exec(`sed -i '' 's/componentName/${name}/g' ${targetPath}/index.tsx`)
  exec(
    `sed -i '' 's/COMPONENTNAME/${pascalCaseName}/g' ${storybookPath}/${name}.stories.tsx`,
  )
  exec(
    `sed -i '' 's/componentName/${name}/g' ${storybookPath}/${name}.stories.tsx`,
  )

  const fragmentsPath = `${gitRoot}/lib/graphql/fragments.ts`
  const fragmentsTs = readFileSync(fragmentsPath, { encoding: "utf-8" })

  const fragmentsMatches = fragmentsTs.match(/\${[\w]+Query}/gm)
  const fragmentsMatch = fragmentsMatches.pop()

  const fragmentsFormattedValue = `${fragmentsMatch}\n        \${${name}Query}`

  const fragmentsImportMatches = fragmentsTs.match(/import { QUERY as(.*)\n/gm)
  const fragmentsImportMatch = fragmentsImportMatches.pop()

  const fragmentsImportFormattedValue = `${fragmentsImportMatch}import { QUERY as ${name}Query } from "@/pageComponents/${name}/query"\n`

  let formattedFragmentsTs = fragmentsTs.replace(
    fragmentsMatch,
    fragmentsFormattedValue,
  )
  formattedFragmentsTs = formattedFragmentsTs.replace(
    fragmentsImportMatch,
    fragmentsImportFormattedValue,
  )

  writeFileSync(fragmentsPath, formattedFragmentsTs, { encoding: "utf-8" })
  writeInfo(`${fragmentsPath} modified.`)

  const pageComponentsPath = `${gitRoot}/components/pageComponents/index.tsx`
  const pageComponentsFile = readFileSync(pageComponentsPath, {
    encoding: "utf8",
  })

  const pageComponentsMatches = pageComponentsFile.match(
    /Page_Pagecomponentsgroup_PageComponents_(.*\S)\n(.*)\n(.*)\)/gm,
  )

  const pageComponentsMatch = pageComponentsMatches.pop()

  const formattedPageComponentImportValue = `${pageComponentsMatch},
  Page_Pagecomponentsgroup_PageComponents_${pascalCaseName}: dynamic(
    () => import("@/pageComponents/${name}")
  )`

  const formattedPageComponentsFile = pageComponentsFile.replace(
    pageComponentsMatch,
    formattedPageComponentImportValue,
  )

  writeFileSync(pageComponentsPath, formattedPageComponentsFile, {
    encoding: "utf8",
  })
  writeInfo(`${pageComponentsPath} modified.`)

  const typesPath = `${gitRoot}/types/graphql/pageComponents.ts`
  const typesTs = readFileSync(typesPath, { encoding: "utf-8" })

  const typesMatches = typesTs.match(/import type { T(.*)/gm)
  const typesMatch = typesMatches.pop()

  const typesImportMatches = typesTs.match(/  \| T(.*)/gm)
  const typesImportMatch = typesImportMatches.pop()

  const typesImportFormattedValue = `${typesMatch}\nimport type { T${pascalCaseName} } from "@/pageComponents/${name}"`
  const typesFormattedValue = `${typesImportMatch}\n  | T${pascalCaseName}`

  let formattedTypesTs = typesTs.replace(typesMatch, typesImportFormattedValue)
  formattedTypesTs = formattedTypesTs.replace(
    typesImportMatch,
    typesFormattedValue,
  )

  writeFileSync(typesPath, formattedTypesTs, {
    encoding: "utf8",
  })
  writeInfo(`${typesPath} modified.`)

  process.chdir(`${sitesPath}/${apiName}`)

  const snakeCaseName = camelToSnakeCase(name)
  const kebabCaseName = snakeToKebabCase(snakeCaseName)

  gitRoot = await exec("git rev-parse --show-toplevel")
  gitRoot = gitRoot.stdout.trim()
  process.chdir(gitRoot)

  targetPath = `${gitRoot}/site/web/app/themes/lisa/includes/Fields/page-components/${kebabCaseName}.php`

  cpSync(`${__dirname}/templates/pageComponents/page-component.php`, targetPath)
  await exec(
    `sed -i '' 's/COMPONENTNAMESNAKECASE/${snakeCaseName}/g' ${targetPath}`,
  )
  await exec(`sed -i '' 's/COMPONENTLABEL/${label}/g' ${targetPath}`)

  writeInfo(`${targetPath} created.`)

  process.chdir("site/web")

  const meta = JSON.stringify({
    page_components: [snakeCaseName],
    _page_components: "field_page_components_flexible",
  })
  const postIdOutput = await exec(
    `wp post create --post_type=page --post_title="Component: ${label}" --post_name=${kebabCaseName} --post_status=publish --porcelain --meta_input='${meta}'`,
  )

  const postId = postIdOutput.stdout.trim()
  process.chdir(gitRoot)

  writeStep(`Page component ${label} created!`)

  writeStep(`Page ${label} created.`)
  writeInfo(
    `Edit it here: ${chalk.bold(
      `https://${apiName}.test/wp/wp-admin/post.php?post=${postId}&action=edit`,
    )}`,
  )
  writeInfo(
    `Visit it here: ${chalk.bold(`http://localhost:3000/${kebabCaseName}`)}`,
  )
  writeInfo(
    "Your next step is to add the needed ACF fields in the api repo, add them to your new type, your new query and use them in your new component.",
  )
  writeSuccess("GLHF!")
}

const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

const snakeToKebabCase = (str) => str.replace("_", "-")
