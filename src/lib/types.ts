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
      color: string;
    };
    large: {
      value: string;
      color: string;
    };
  };
  series: ChartSeriesGlucose[];
};

export type CurrentWeather = {
  time?: string;
  interval?: number;
  temperature_2m: number;
  apparent_temperature?: number;
  is_day?: number;
  weather_code?: number;
  cloud_cover: number;
};

export interface WeatherData {
  current: CurrentWeather;
  daily: SolarData;
}

export type SolarData = {
  sunrise: Date[];
  sunset: Date[];
};
