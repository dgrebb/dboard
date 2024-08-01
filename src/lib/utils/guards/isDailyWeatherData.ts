import type { DailyWeatherData } from '@types';

/**
 * Type guard function to check if data is DailyWeatherData.
 *
 * @param data - The data to check.
 * @returns A boolean indicating whether the data is DailyWeatherData.
 */
export const isDailyWeatherData = (data: unknown): data is DailyWeatherData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as DailyWeatherData).weather_code) &&
    (data as DailyWeatherData).weather_code.every(
      (item) => typeof item === 'number'
    )
  );
};
