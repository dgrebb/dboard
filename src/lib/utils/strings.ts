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

/**
 * Converts a time string in the format "HH:MM:SS" to milliseconds.
 *
 * @param {string} time - The time string to convert.
 * @returns {number} The time in milliseconds.
 */
export const timeStringToMilliseconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

/**
 * Converts a time string in the format "HH:MM:SS" to seconds.
 *
 * @param {string} time - The time string to convert.
 * @returns {number} The time in milliseconds.
 */
export const timeStringToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 * 60 + minutes * 60 + seconds;
};

/**
 * Converts a total number of seconds to a formatted string "mm:ss".
 *
 * @param {number} seconds - The total number of seconds.
 * @returns {string} The formatted time string in "mm:ss" format.
 */
export const formatSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Processes a string to add HTML line break entities before certain characters.
 *
 * @param {string} input - The input string to process.
 * @returns {string} - The processed string with HTML line break entities.
 */
export const addHtmlLineBreaks = (input: string): string => {
  // Define the regex to match characters and patterns
  const regex = /([[{(\]])|(([^-]-[^-])|( - ))/g;

  // Replace matched characters with a line break before them
  return input.replace(regex, (match, p1, p2) => {
    if (p1) {
      // If the match is an opening character, add a line break before it
      return `<br>${p1}`;
    }
    if (p2) {
      // If the match is a hyphen, keep the hyphen and add a line break after it
      return `${match}<br>`;
    }
    // Default case (should not be hit due to specific patterns above)
    return match;
  });
};
