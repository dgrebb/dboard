export type StreamType = {
  id: string;
  name: string;
  path: string;
  upstreamAPIURL: string;
  refreshInterval: number;
  // upstreamAPIOptions: {
  //   headers?: {
  //     [key: string]: string;
  //   };
  //   method: string;
  //   redirect?: string;
  //   body?: string;
  // };
  // values: string[];
};

export type StreamsType = StreamType[];

export interface FetchOptions extends RequestInit {
  // You can add any custom options specific to your application
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

export type CurrentWeatherType = {
  time?: string;
  interval?: number;
  apparent_temperature: number;
  temperature_2m: number;
  is_day?: number;
  weather_code?: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
};

export interface WeatherData {
  success: boolean;
  current: CurrentWeatherType;
  daily: SolarData;
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

export type SeptaDataNextToArrive = {
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

export enum WidgetDataType {
  object,
  NightScoutData,
}

export type WidgetData = {
  type: string;
  name: string;
  stream: StreamType;
  data: WidgetDataType;
};

export type NightScoutReading = {
  _id: string;
  sgv: number;
  date: number;
  dateString: string;
  trend: number;
  direction: string;
  device: string;
  type: string;
  utcOffset: number;
  sysTime: string;
  mills: number;
};

export type NightScoutData = NightScoutReading[];
