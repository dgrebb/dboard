/**
 * Preserves acronyms in a string by converting them to lowercase.
 *
 * @param str - The input string to process.
 * @returns The processed string with acronyms preserved.
 */
function preserveAcronyms(str: string): string {
  return str.replace(/([A-Z]{2,})/g, (match) => match.toLowerCase());
}

/**
 * Generates an ID by converting the input string to lowercase,
 * replacing spaces with underscores, and removing special characters.
 * Keeps acronyms intact.
 *
 * @param input - The input string to convert.
 * @returns The generated ID.
 */
export function generateID(input: string): string {
  // Replace spaces with underscores and remove special characters
  const result = input
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_'); // Replace spaces with underscores

  return preserveAcronyms(result);
}

/**
 * Converts the input string to camelCase,
 * keeping acronyms intact.
 *
 * @param input - The input string to convert.
 * @returns The camelCase string.
 */
export function toCamelCase(input: string): string {
  // Function to capitalize the first letter of each word except the first word
  const capitalize = (str: string): string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    );
  };

  // Remove special characters and replace spaces with a single space
  const cleanedInput = input
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ');

  const camelCased = cleanedInput
    .split(' ')
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
    .join('');

  return preserveAcronyms(camelCased);
}
