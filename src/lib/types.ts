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
  temperature_2m: number;
  apparent_temperature?: number;
  is_day?: number;
  weather_code?: number;
  cloud_cover: number;
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
