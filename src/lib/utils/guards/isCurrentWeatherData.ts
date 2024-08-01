import type { CurrentWeatherData } from '@types';

/**
 * Type guard function to check if data is CurrentWeatherData.
 *
 * @param data - The data to check.
 * @returns A boolean indicating whether the data is CurrentWeatherData.
 */
export const isCurrentWeatherData = (
  data: unknown
): data is CurrentWeatherData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as CurrentWeatherData).temperature_2m === 'number'
  );
};
