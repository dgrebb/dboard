/**
 * Convert timecode string (HH:MM:SS) to seconds
 * @param {string} timecode - The timecode string
 * @returns {number} - The total number of seconds
 */
const timecodeToSeconds = (timecode: string): number => {
  const [hours, minutes, seconds] = timecode.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Calculate the percentage complete
 * @param {string} total - The total time timecode (HH:MM:SS)
 * @param {string} current - The current time timecode (HH:MM:SS)
 * @returns {number} - The percentage complete
 */
export const calculatePercentageComplete = (
  total: string,
  current: string
): number => {
  const totalSeconds = timecodeToSeconds(total);
  const currentSeconds = timecodeToSeconds(current);

  if (totalSeconds === 0) {
    throw new Error('Total time cannot be zero');
  }

  return (currentSeconds / totalSeconds) * 100;
};

/**
 * Determines if the relative time position and total time are closer together than they are apart.
 * @param {number} relativeSeconds - The relative time position in seconds
 * @param {number} totalSeconds - The total time of the track in seconds
 * @returns {boolean} True if the times are closer together than apart, false otherwise.
 */
export const areTimesCloserTogether = (
  relativeSeconds: number,
  totalSeconds: number
): boolean => {
  const difference = Math.abs(totalSeconds - relativeSeconds);
  return difference < totalSeconds / 2;
};
