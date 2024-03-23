export interface FetchOptions extends RequestInit {
  // You can add any custom options specific to your application
  customOption?: string;
}

export type ChartSeriesGlucose = {
  sgv: number;
};

export interface DBoardItem {
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
}

export interface CurrentWeather {
  current: number;
  weatherCode: number[];
  isDay: boolean;
}
