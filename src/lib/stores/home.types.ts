import type { LocationType, WeatherData } from '../types';

/**
 * Type representing home data.
 */
export type HomeData = {
  location: LocationType;
  lights?: unknown;
  weather?: WeatherData;
};
