// TODO: Clean up logs
import type { TypeOfWidget, WidgetData, WidgetDataType } from '../types';

export const createWidget = function createWidget(
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
    data: {},
  });

  const setData = function setData(data: WidgetDataType) {
    // console.log('🚀 ~ setData ~ data:', data);
    widgetStore = {
      ...widgetStore,
      data,
    };
    // console.log('🚀 ~ setData ~ widget:', widgetStore.data);
  };

  return {
    get streamSettings() {
      return widgetStore.stream;
    },
    get getData(): WidgetDataType {
      return widgetStore.data;
    },
    setData,
  };
};
