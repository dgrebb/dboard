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

  const setData = function setData(data: WeatherData) {
    console.log('🚀 ~ setData ~ data:', data);
    widgetStore = {
      ...widgetStore,
      data,
    };
  };

  return {
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
    currentRoundTemperature: (): number => {
      const data = widgetStore.data;
      console.log('🚀 ~ data:', data);
      let temperature = 0;
      if (isWeatherData(data)) {
        temperature = Math.round(data.current.temperature_2m);
      }
      return temperature;
    },
    setData,
  };
};
