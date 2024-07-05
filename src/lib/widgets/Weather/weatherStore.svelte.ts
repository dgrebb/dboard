import {
  isWeatherData,
  type TypeOfWidget,
  type WeatherData,
  type WidgetData,
} from '$lib/types';

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
    setData: (data: WeatherData) => {
      console.log('🗿 ~ rune data:', data);
      widgetStore = {
        ...widgetStore,
        data,
      };
    },

    weather: (): unknown => {
      return widgetStore.data;
    },

    currentRoundTemperature: (): number => {
      if (
        widgetStore.data !== undefined &&
        widgetStore.data.current !== undefined
      ) {
        return Math.round(widgetStore.data.current.temperature_2m);
      }
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
