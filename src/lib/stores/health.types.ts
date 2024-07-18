import type { NightScoutData } from '../types';

/**
 * Type representing health data.
 */
export type HealthData = {
  nightScout?: false | NightScoutData;
};
