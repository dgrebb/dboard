import type { NightScoutData, TypeOfWidget, WidgetData } from '../types';

function getGraphSettings(currentBG: number, maxMeasurable: number) {
  let mainColor: string;
  let max: number;
  switch (true) {
    case currentBG < 70:
      mainColor = 'rgba(255, 0, 0, 0.5)';
      max = 100;
      break;
    case currentBG < 100:
      mainColor = '#2a5c2c';
      max = 100;
      break;
    case currentBG < 160:
      mainColor = '#2a5c2c';
      max = 200;
      break;
    case currentBG < 190:
      mainColor = '#8cbf2e';
      max = 200;
      break;
    case currentBG < 300:
      mainColor = '#fff700';
      max = 300;
      break;
    default:
      mainColor = '#ff00f7';
      max = maxMeasurable;
      break;
  }
  return {
    mainColor,
    max,
  };
}

export const createNightScoutWidget = function createWidget(
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
    data: false,
  });

  const setData = function setData(data: NightScoutData) {
    widgetStore = {
      ...widgetStore,
      data,
    };
  };

  const getSeries = function getSeries() {
    const data = widgetStore.data;
    let series: number[] = [];
    if (Array.isArray(data) && data.length) {
      series = data.map((reading) => reading.sgv);
    }
    return series;
  };

  return {
    get streamSettings() {
      return widgetStore.stream;
    },
    get getWidget(): WidgetData {
      return widgetStore as WidgetData;
    },
    get getData(): NightScoutData {
      return widgetStore.data as NightScoutData;
    },
    get type(): TypeOfWidget {
      return widgetStore.type as TypeOfWidget;
    },
    getSeries,
    getGraphSettings,
    setData,
  };
};
