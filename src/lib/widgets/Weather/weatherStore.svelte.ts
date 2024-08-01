import {
  type CurrentWeatherData,
  type DailyWeatherData,
  type TypeOfWidget,
  type WeatherData,
  type WidgetData,
} from '@types';
import {
  isCurrentWeatherData,
  isDailyWeatherData,
  isWeatherData,
} from '@guards';

export const createWeatherWidget = function createWidget(
  type: TypeOfWidget,
  name: string,
  id: string,
  path: string,
  upstreamAPIURL: string,
  refreshInterval: number
) {
  let widgetStore: WidgetData = $state({
    type,
    name,
    stream: {
      name,
      id,
      path,
      upstreamAPIURL,
      refreshInterval,
    },
    data: undefined,
  });

  return {
    setData: async (data: WeatherData) => {
      widgetStore = {
        ...widgetStore,
        data,
      };
    },

    weather: (): WeatherData => {
      return widgetStore.data as WeatherData;
    },

    current: (): CurrentWeatherData | undefined => {
      const { data } = widgetStore;
      let weatherData = undefined;
      if (
        data !== undefined &&
        isWeatherData(data) &&
        data?.current !== undefined &&
        isCurrentWeatherData(data.current)
      ) {
        weatherData = data.current;
      }
      return weatherData;
    },

    daily: (): DailyWeatherData | undefined => {
      const { data } = widgetStore;
      let weatherData = undefined;
      if (
        data !== undefined &&
        isWeatherData(data) &&
        data?.daily !== undefined &&
        isDailyWeatherData(data.daily)
      ) {
        weatherData = data.daily;
      }
      return weatherData;
    },

    currentRoundTemperature: (): number | undefined => {
      const { data } = widgetStore;
      let temperature: number | undefined = undefined;
      if (
        data !== undefined &&
        isWeatherData(data) &&
        data?.current !== undefined &&
        isCurrentWeatherData(data.current)
      ) {
        temperature = Math.round(data.current.temperature_2m);
      }
      return temperature;
    },

    streamSettings: () => {
      return widgetStore.stream;
    },
    getWidget: (): WidgetData => {
      return widgetStore as WidgetData;
    },
    getData: (): WeatherData => {
      return widgetStore.data as WeatherData;
    },
    type: (): TypeOfWidget => {
      return widgetStore.type as TypeOfWidget;
    },
  };
};
