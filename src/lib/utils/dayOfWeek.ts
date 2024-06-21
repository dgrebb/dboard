export const dayOfWeek = function dayOfWeek(date: string | Date | number) {
  if (typeof date === 'string') {
    const dateFromString = new Date(date);
    return dateFromString.toLocaleDateString('en-us', { weekday: 'long' });
  }
};
