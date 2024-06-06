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
    small: {
      value: string;
      direction: string;
      color: string;
    };
    large: {
      value: string;
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
