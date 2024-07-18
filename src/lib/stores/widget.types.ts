import type {
  CurrentWeatherData,
  LocationSettings,
  MusicData,
  NightScoutData,
  SeptaNextToArriveData,
  StreamType,
  WeatherData,
} from '$types';

/**
 * Enum representing the types of widgets available.
 */
export enum TypeOfWidget {
  NightScout = 'NightScout',
  NowPlaying = 'NowPlaying',
  Weather = 'Weather',
  Music = 'Music',
  NextToArrive = 'NextToArrive',
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
 * Type representing widget data.
 */
export type WidgetData = WidgetSettings & {
  stream: StreamType;
  data: PossibleWidgetData | undefined;
};

/**
 * Type representing possible widget data options.
 */
export type PossibleWidgetData =
  | NightScoutData
  | CurrentWeatherData
  | WeatherData
  | MusicData
  | SeptaNextToArriveData[];
