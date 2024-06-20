import type { NightScoutData, TypeOfWidget, WidgetData } from '$lib/types';
import { isNightScoutData } from '$lib/types';
import { mapNightScoutDirectionIcon } from '$lib/_helpers/directionIconMap';

function getColors(currentReading: number) {
  let mainColor: string;
  let backgroundColor: string;
  switch (true) {
    case currentReading < 80:
      mainColor = '#ffa8ed';
      backgroundColor = '#cc00c5';
      break;
    case currentReading < 100:
      mainColor = '#495900';
      backgroundColor = '#9eb04c';
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
      mainColor = '#4d4a09';
      backgroundColor = '#fff700';
      break;
    default:
      mainColor = '#e80000';
      backgroundColor = '#5e0000';
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

  const getSeries = function getSeries() {
    const data = widgetStore.data;
    let series: number[] = [];
    if (Array.isArray(data) && data.length) {
      series = data.map((reading) => reading.sgv);
    }
    return series;
  };

  const getChronologicalSeries = function getSeries() {
    const data = widgetStore.data;
    let series: number[] = [];
    if (Array.isArray(data) && data.length) {
      series = data.map((reading) => reading.sgv);
    }
    return series.reverse();
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

  const getDirectionIcon = function getDirectionIcon(): string {
    const data = widgetStore.data;
    let icon = 'iconamoon:cloud-error-light';
    if (isNightScoutData(data)) {
      icon = mapNightScoutDirectionIcon(data);
    }
    return icon;
  };

  const getDifference = function getDifference() {
    const data = widgetStore.data;
    let difference = 0;

    if (isNightScoutData(data)) {
      const current = data[0].sgv;
      const last = data[1].sgv;
      difference = current - last;
    }
    return difference > 0 ? `+${difference}` : difference;
  };

  const setData = function setData(data: NightScoutData) {
    widgetStore = {
      ...widgetStore,
      data,
    };
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
    getChronologicalSeries,
    getCurrent,
    getLast,
    getDifference,
    getColors,
    getDirectionIcon,
    setData,
  };
};
