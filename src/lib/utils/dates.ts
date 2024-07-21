/**
 * Formats a date object to a string in the format YY.MM.DD.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 * @throws {Error} If the date parts are not found.
 */
export const formatDateYYMMDD = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };

  const dateParts = new Intl.DateTimeFormat('en-GB', options).formatToParts(
    date
  );

  const year = dateParts.find((part) => part.type === 'year')?.value;
  const month = dateParts.find((part) => part.type === 'month')?.value;
  const day = dateParts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Failed to format date');
  }

  return `${year}.${month}.${day}`;
};

/**
 * Formats a date object to a string in the format MM.DD.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 * @throws {Error} If the date parts are not found.
 */
export const formatDateMMDD = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
  };

  const dateParts = new Intl.DateTimeFormat('en-GB', options).formatToParts(
    date
  );

  const month = dateParts.find((part) => part.type === 'month')?.value;
  const day = dateParts.find((part) => part.type === 'day')?.value;

  if (!month || !day) {
    throw new Error('Failed to format date');
  }

  return `${month}.${day}`;
};
