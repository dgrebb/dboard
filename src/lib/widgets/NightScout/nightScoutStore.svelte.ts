import type { NightScoutData, TypeOfWidget, WidgetData } from '$lib/types';
import { isNightScoutData } from '$lib/types';
import { mapNightScoutDirectionIcon } from '$utils/nightscout';
import { mapNightScoutColors } from '$utils/nightscout';

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
    data: undefined,
  });

  const getColors = () => {
    const { data } = widgetStore;
    let value = 0;
    if (isNightScoutData(data)) {
      value = data[0].sgv;
    }
    return mapNightScoutColors(value);
  };

  const getSeries = function getSeries() {
    const { data } = widgetStore;
    let series: number[] = [];
    if (Array.isArray(data) && data.length) {
      series = data.map((reading) => reading.sgv);
    }
    return series;
  };

  const getChronologicalSeries = function getSeries() {
    const { data } = widgetStore;
    let series: number[] = [];
    if (Array.isArray(data) && data.length) {
      series = data.map((reading) => reading.sgv);
    }
    return series.reverse();
  };

  const getCurrent = function getCurrent() {
    const { data } = widgetStore;
    let current = 0;
    if (isNightScoutData(data)) {
      current = data[0].sgv;
    }
    return current;
  };

  const getLast = function getLast() {
    const { data } = widgetStore;
    let last = 0;
    if (isNightScoutData(data)) {
      last = data[1].sgv;
    }
    return last;
  };

  const getDirectionIcon = function getDirectionIcon(): string {
    const { data } = widgetStore;
    let icon = 'iconamoon:cloud-error-light';
    if (isNightScoutData(data)) {
      icon = mapNightScoutDirectionIcon(data);
    }
    return icon;
  };

  const getDifference = function getDifference() {
    const { data } = widgetStore;
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
