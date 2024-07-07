/**
 * A custom fetch function type.
 *
 * @param input - The resource that you wish to fetch.
 * @param init - An options object containing settings like method, headers, etc.
 * @returns A promise that resolves with a Response object.
 */
export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

/**
 * Extended fetch options including custom options.
 */
export interface FetchOptions extends RequestInit {
  customOption?: string;
}

/**
 * A Timer type that works in both Node.js and browser environments.
 * In Node.js, setTimeout and setInterval return an object with
 * additional methods and properties, while in browsers they return a number.
 */
export type Timer = ReturnType<typeof setTimeout>;

/**
 * A type representing an object or an array.
 */
export type ObjectOrArray = Record<string, unknown> | unknown[];

/**
 * Type representing a stream configuration.
 */
export type StreamType = {
  id: string;
  name: string;
  path: string;
  upstreamAPIURL: string;
  refreshInterval: number;
};

/**
 * Type representing an array of stream configurations.
 */
export type StreamsType = StreamType[];

/**
 * Type representing a glucose data point in a chart series.
 */
export type ChartSeriesGlucose = {
  sgv: number;
};

/**
 * Type representing a dashboard item.
 */
export type DBoardItem = {
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
};

/**
 * Type representing current weather data.
 */
export type CurrentWeatherData = {
  time?: string;
  interval?: number;
  apparent_temperature?: number;
  temperature_2m: number;
  is_day: number;
  weather_code?: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
};

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

/**
 * Type representing daily weather data.
 */
export type DailyWeatherData = {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  time: string[];
  weather_code: number[];
};

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

/**
 * Interface representing weather data response.
 */
export type WeatherData = {
  success: boolean;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
};

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

/**
 * Type representing solar data with sunrise and sunset times.
 */
export type SolarData = {
  sunrise: Date[];
  sunset: Date[];
  isDay: number;
};

/**
 * Type representing music data.
 */
export type MusicData = {
  album: string;
  artist: string;
  title: string;
};

/**
 * Type representing SEPTA next-to-arrive data.
 */
export type SteptaNextToArriveData = {
  orig_train: string;
  orig_line: string;
  orig_departure_time: string;
  orig_arrival_time: string;
  orig_delay: string;
  isdirect: string;
};

const steptaNextToArriveDataKeys: (keyof SteptaNextToArriveData)[] = [
  'orig_train',
  'orig_line',
  'orig_departure_time',
  'orig_arrival_time',
  'orig_delay',
  'isdirect',
];

export function isSteptaNextToArriveDataArray(
  arr: unknown[]
): arr is SteptaNextToArriveData[] {
  return (
    Array.isArray(arr) &&
    arr.every(
      (obj) =>
        typeof obj === 'object' &&
        obj !== null &&
        steptaNextToArriveDataKeys.every(
          (key) => typeof obj[key as keyof typeof obj] === 'string'
        )
    )
  );
}

/**
 * Type representing icon properties.
 */
export type IconProps = {
  icon: string;
  color: string;
  name: string;
};

/**
 * Interface representing a map of icon properties indexed by number.
 */
export interface IconMap {
  [index: number]: IconProps;
}

/**
 * Type representing location data.
 */
export type LocationType = {
  primary?: boolean;
  name: string;
  timeZone: TimeZone;
  latitude: number;
  longitude: number;
};

/**
 * Type representing a collection of location data indexed by string keys.
 */
export type LocationsType = { [key: string]: LocationType };

/**
 * Type representing a location store which includes a key.
 */
export type LocationStore = LocationType & { key: string };

/**
 * Type representing global settings.json (or database)
 */
export type Settings = {
  widgets: WidgetSettings[];
  otherLocations: WidgetSettings[];
};

/**
 * Enum representing the types of widgets available.
 */
export enum TypeOfWidget {
  NightScout = 'NightScout',
  NowPlaying = 'NowPlaying',
  Weather = 'Weather',
  CurrentWeatherLeg = 'CurrentWeatherLeg',
  Music = 'Music',
}

/**
 * Type representing Widgets as defined by settings
 */
export type WidgetSettings = {
  type: TypeOfWidget;
  name?: string;
  settings?: {
    location?: LocationSettings;
  };
};

/**
 * Current Weather widget settings type
 */
export type WeatherSettings = {
  location: LocationType;
  tempo: number;
};

export type LocationSettings = {
  primary: boolean;
  name: string;
  timeZone: string;
  latitude: number;
  longitude: number;
};

/**
 * Type representing widget data.
 */
export type WidgetData = WidgetSettings & {
  stream: StreamType;
  data: PossibleWidgetData | undefined;
};

export const isLocationSettings = (
  location: unknown
): location is LocationType => {
  const loc = location as LocationType;
  return (
    typeof loc.primary === 'boolean' &&
    typeof loc.name === 'string' &&
    typeof loc.timeZone === 'string' &&
    typeof loc.latitude === 'number' &&
    typeof loc.longitude === 'number'
  );
};

export const isWidgetSettings = (widget: unknown): widget is WidgetSettings => {
  const wgt = widget as WidgetSettings;
  return (
    typeof wgt.type === 'string' &&
    (!wgt.name || typeof wgt.name === 'string') &&
    (!wgt.settings ||
      (wgt.settings &&
        (!wgt.settings.location || isLocationSettings(wgt.settings.location))))
  );
};

export const isTypeOfWidget = (type: string): type is TypeOfWidget => {
  return Object.values(TypeOfWidget).includes(type as TypeOfWidget);
};

/**
 * Type representing a NightScout reading.
 */
export type NightScoutReading = {
  _id: string;
  sgv: number;
  trend: number;
  direction: string;
};

/**
 * Type representing an array of NightScout readings.
 */
export type NightScoutData = NightScoutReading[];

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

/**
 * Type representing possible widget data options.
 */
export type PossibleWidgetData =
  | NightScoutData
  | CurrentWeatherData
  | WeatherData
  | MusicData
  | SteptaNextToArriveData;

/**
 * Type representing a NightScout widget.
 */
export type NightScoutWidget = {
  type: 'NightScout';
  data: NightScoutData;
};

/**
 * Type representing home data.
 */
export type HomeData = {
  location: LocationType;
  nowPlaying: NowPlayingData;
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

/**
 * Type representing health data.
 */
export type HealthData = {
  nightScout?: false | NightScoutData;
};

/**
 * Type representing now playing data.
 */
export type NowPlayingData = {
  status?: string;
  artist: string;
  album: string;
  art: string;
  backgroundGradient: string;
  foregroundGradient: string;
  loved: boolean;
  relativeTimePosition: string;
  title: string;
  totalTime: string;
};

export type GradientResult = {
  backgroundGradient: string;
  foregroundGradient: string;
};

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

export type UIState = {
  modalState: ModalState;
};

export type ModalState = {
  isActive: boolean;
  component: 'music' | 'nightscout' | 'weather' | undefined;
};
