// TODO: Clean up logs
import type { ObjectOrArray, TypeOfWidget, WidgetData } from '../types';

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

  const setData = function setData(data: ObjectOrArray) {
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
    get getData(): ObjectOrArray {
      return widgetStore.data;
    },
    setData,
  };
};
