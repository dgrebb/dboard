import type { NightScoutData } from '../types';

/**
 * Type representing health data.
 */
export interface HealthData {
  nightScout?: false | NightScoutData;
}
