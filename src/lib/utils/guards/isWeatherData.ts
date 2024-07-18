import type { WeatherData, WidgetData } from '$types';

/**
 * Type guard function to check if data is WeatherData.
 *
 * @param data - The data to check.
 * @returns A boolean indicating whether the data is WeatherData.
 */
export const isWeatherData = (
  data: WidgetData['data']
): data is WeatherData => {
  return typeof data === 'object' && 'current' in data && 'daily' in data;
};
