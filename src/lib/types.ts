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

export interface CurrentWeather {
  time?: string;
  interval?: number;
  temperature_2m: number;
  apparent_temperature?: number;
  is_day?: number;
  weather_code?: number;
}

export interface DailyWeather {
  daily: {
    sunrise: Date[];
    sunset: Date[];
  };
}

export type SolarData = {
  sunrise: Date;
  sunset: Date;
};
