import type { WeatherIconComponent } from '@types';

/**
 * Type representing icon properties.
 */
export interface IconProps {
  icon: string;
  component?: WeatherIconComponent;
  color: string;
  name: string;
}

/**
 * Interface representing a map of icon properties indexed by number.
 */
export type IconMap = Record<number, IconProps>;

/**
 * Type representing current weather data.
 */
export interface CurrentWeatherData {
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
}

/**
 * Type representing daily weather data.
 */
export interface DailyWeatherData {
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  time: string[];
  weather_code: number[];
}

/**
 * Interface representing weather data response.
 */
export interface WeatherData {
  success: boolean;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
}
