import type {
  NightScoutData,
  NightScoutReading,
  TypeOfWidget,
  WidgetData,
} from '../types';

function isNightScoutData(
  data: WidgetData['data']
): data is NightScoutReading[] {
  return (
    Array.isArray(data) &&
    data.every(
      (entry) =>
        typeof entry === 'object' &&
        'sgv' in entry &&
        typeof entry.sgv === 'number'
    )
  );
}

function getColors(currentReading: number) {
  let mainColor: string;
  let backgroundColor: string;
  switch (true) {
    case currentReading < 70:
      mainColor = 'rgba(255, 0, 0, 0.5)';
      backgroundColor = 'rgba(255, 0, 0, 0.5)';
      break;
    case currentReading < 100:
      mainColor = '#2a5c2c';
      backgroundColor = '#2a5c2c';
      break;
    case currentReading < 160:
      mainColor = '#056e00';
      backgroundColor = '#00d115';
      break;
    case currentReading < 190:
      mainColor = '#2f7a00';
      backgroundColor = '#62ff00';
      break;
    case currentReading < 300:
      mainColor = '#7b9600';
      backgroundColor = '#fff700';
      break;
    default:
      mainColor = '#ff00f7';
      backgroundColor = '#ff00f7';
      break;
  }
  return {
    mainColor,
    backgroundColor,
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

  const getCurrent = function getCurrent() {
    const data = widgetStore.data;
    let current = 0;
    if (isNightScoutData(data)) {
      current = data[0].sgv;
    }
    return current;
  };

  const getLast = function getLast() {
    const data = widgetStore.data;
    let last = 0;
    if (isNightScoutData(data)) {
      last = data[1].sgv;
    }
    return last;
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
    getCurrent,
    getLast,
    getColors,
    setData,
  };
};
