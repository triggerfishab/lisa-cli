/**
 * Converts a string from camelCase to snake_case.
 * 
 * @param {*} str 
 * @returns 
 */
export const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

/**
 * Converts a string from snake_case to kebab-case.
 * @param {*} str 
 * @returns 
 */
export const snakeToKebabCase = (str) => str.replace("_", "-")

/**
 * Converts a string from kebab-case to a Human readable string.
 * @param {*} str 
 * @returns 
 */
export const kebabCaseToHuman = (str) => {
	str = str.replace("-", " ")
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts a string from PascalCase to camelCase.
 * @param {*} str 
 * @returns 
 */
export const pascalToCamelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1)