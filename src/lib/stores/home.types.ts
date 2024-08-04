import type { LocationType, WeatherData } from '../types';

/**
 * Type representing home data.
 */
export interface HomeData {
  location: LocationType;
  lights?: unknown;
  weather?: WeatherData;
}
