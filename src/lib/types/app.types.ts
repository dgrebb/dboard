import type { WidgetSettings, ChartSeriesGlucose } from '@types';

/**
 * Type representing global settings.json (or database)
 */
export interface Settings {
  widgets: WidgetSettings[];
  otherLocations: WidgetSettings[];
}

/**
 * Current Weather widget settings type
 */
export interface WeatherSettings {
  location: LocationType;
  tempo: number;
}

export interface LocationSettings {
  primary: boolean;
  name: string;
  timeZone: string;
  latitude: number;
  longitude: number;
}

/**
 * Type representing a dashboard item.
 */
export interface DBoardItem {
  requestInterval: number;
  title: string;
  content: {
    trend: {
      direction: string;
    };
    small: {
      value: string;
      direction: string;
      color: string;
    };
    large: {
      value: string | number;
      color: string;
    };
  };
  series: ChartSeriesGlucose[];
}

// NOTE: Maintain as needed
export type TimeZone =
  | 'UTC'
  | 'Europe/London'
  | 'America/New_York'
  | 'America/Denver'
  | 'Asia/Tokyo'
  | 'Europe/Paris'
  | 'Europe/Berlin'
  | 'America/Chicago'
  | 'America/Los_Angeles'
  | 'Asia/Kolkata'
  | 'Australia/Sydney'
  | 'Pacific/Auckland';

/**
 * Type representing location data.
 */
export interface LocationType {
  primary?: boolean;
  name: string;
  timeZone: TimeZone;
  latitude: number;
  longitude: number;
}

/**
 * Type representing a collection of location data indexed by string keys.
 */
export type LocationsType = Record<string, LocationType>;

/**
 * Type representing a location store which includes a key.
 */
export type LocationStore = LocationType & { key: string };
