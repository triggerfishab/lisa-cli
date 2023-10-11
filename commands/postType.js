import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import prompts from "prompts";
import { getApiName, getAppName, getProjectName } from "../lib/app-name";
import { getSitesPath } from "../lib/path";
import { writeStep } from "../lib/write";
import { camelToSnakeCase, kebabCaseToHuman, pascalToCamelCase, snakeToKebabCase } from "../lib/helpers";

export async function createPostType() {
	await getProjectName()

	const appName = await getAppName()
	const apiName = await getApiName()
	const sitesPath = await getSitesPath()

	process.chdir(`${sitesPath}/${apiName}`)

	writeStep("Creating a new post type")

  let gitRoot = await exec("git rev-parse --show-toplevel")
  gitRoot = gitRoot.stdout.trim()
	let targetPath = `${gitRoot}/site/web/app/themes/lisa/includes/PostTypes`

  process.chdir(gitRoot)

	let { name, label, graphqlSingularName, graphqlPluralName } = await prompts([
		{
			type: "text",
			name: "name",
			message:
				"What will your new post type be called? Use PascalCase for the name.",
			validate: async (name) => {
				if (existsSync(`${targetPath}/${name}.php`)) {
					return "Post type already exists, please try another name."
				}
				return true
			},
		},
		{
			type: "text",
			name: "label", 
			message:
				"Please provide a title for your post type, it will be used in the admin."
		},
		{
			type: "text",
			name: "graphqlSingularName",
			message:
				"Please provide a GraphQL friendly name for your post type, in singular. Use camelCase for the name."
		},
		{
			type: "text",
			name: "graphqlPluralName",
			message:
				"Please provide a GraphQL friendly name for your post type, in plural. Use camelCase for the name."
		}
	])

	const pascalCaseName = name
	const camelCaseName = pascalToCamelCase(pascalCaseName)
	const snakeCaseName = camelToSnakeCase(camelCaseName)
	const kebabCaseName = snakeToKebabCase(snakeCaseName)
	const humanReadableName = kebabCaseToHuman(kebabCaseName)

	mkdirSync(targetPath)

	cpSync(
		`${__dirname}/templates/postTypes/PostTypeName.php`,
		`${targetPath}/${name}.php`
	)

	exec(
		`sed -i '' '/POSTNAMEKEBABCASE/${kebabCaseName}/g' ${targetPath}/${name}.php`
	)
	exec(
		`sed -i '' '/POSTNAMEHUMAN/${humanReadableName}/g' ${targetPath}/${name}.php`
	)

	const postTypesPath = `${gitRoot}/site/web/app/themes/lisa/includes/post-types.php`
	const postTypesFile = readFileSync(postTypesPath, { encoding: "utf-8" })


}