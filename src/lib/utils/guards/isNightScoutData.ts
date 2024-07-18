import type { WidgetData, NightScoutReading } from '$types';

/**
 * Type guard function to check if data is NightScoutData.
 *
 * @param data - The data to check.
 * @returns A boolean indicating whether the data is NightScoutData.
 */
export const isNightScoutData = (
  data: WidgetData['data']
): data is NightScoutReading[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (entry) =>
        typeof entry === 'object' &&
        'sgv' in entry &&
        typeof entry.sgv === 'number'
    )
  );
};
