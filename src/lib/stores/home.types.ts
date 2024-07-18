import type { LocationType, WeatherData } from '../types';

/**
 * Type representing home data.
 */
export type HomeData = {
  location: LocationType;
  lights?: unknown;
  weather?: WeatherData;
  time?: {
    milliseconds: 0;
    hours: 0;
    minutes: 0;
    seconds: 0;
    date: 0;
  };
};
