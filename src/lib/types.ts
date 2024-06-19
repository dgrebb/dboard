export type ObjectOrArray = Record<string, unknown> | unknown[];

export type StreamType = {
  id: string;
  name: string;
  path: string;
  upstreamAPIURL: string;
  refreshInterval: number;
};

export type StreamsType = StreamType[];

export interface FetchOptions extends RequestInit {
  customOption?: string;
}

export type ChartSeriesGlucose = {
  sgv: number;
};

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

export type CurrentWeather = {
  time?: string;
  interval?: number;
  apparent_temperature?: number;
  temperature_2m: number;
  is_day?: number;
  weather_code?: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
};

export type DailyWeather = {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: number[];
  sunset: number[];
  time: string[];
  weather_code: string[];
};

export interface WeatherData {
  success: boolean;
  current?: CurrentWeather;
  daily?: DailyWeather;
}

export type SolarData = {
  sunrise: Date[];
  sunset: Date[];
};

export type MusicData = {
  album: string;
  artist: string;
  title: string;
};

export type SteptaNextToArriveData = {
  orig_train: string;
  orig_line: string;
  orig_departure_time: string;
  orig_arrival_time: string;
  orig_delay: string;
  isdirect: string;
};

export type IconProps = {
  icon: string;
  color: string;
  name: string;
};

export interface IconMap {
  [index: number]: IconProps;
}

export type LocationType = {
  primary: boolean;
  name: string;
  timezone: string;
  latitude: number;
  longitude: number;
};

export type LocationsType = { [key: string]: LocationType };

export type LocationStore = LocationType & { key: string };

export enum TypeOfWidget {
  NightScout = 'NightScout',
  Weather = 'Weather',
  Music = 'Music',
}

export type WidgetData = {
  type: TypeOfWidget;
  name: string;
  stream: StreamType;
  data: PossibleWidgetData | false;
};

export type NightScoutReading = {
  _id: string;
  sgv: number;
  trend: number;
  direction: string;
};

export type NightScoutData = NightScoutReading[];

export type PossibleWidgetData =
  | NightScoutData
  | CurrentWeather
  | MusicData
  | SteptaNextToArriveData;

export type NightScoutWidget = {
  type: 'NightScout';
  data: NightScoutData;
};

export type HomeData = {
  nowPlaying: NowPlayingData;
  lights?: unknown;
  weather: WeatherData;
  time?: {
    milliseconds: 0;
    hours: 0;
    minutes: 0;
    seconds: 0;
    date: 0;
  };
};

export type NowPlayingData = {
  art: string;
  album: string;
  title: string;
  artist: string;
  loved?: boolean;
};
