// $lib/stores/widget.svelte.ts
import type { PossibleWidgetData, TypeOfWidget, WidgetData } from '../types';

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
    data: false,
  });

  const setData = function setData(data: PossibleWidgetData) {
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
    get getData(): PossibleWidgetData {
      return widgetStore.data as PossibleWidgetData;
    },
    get type(): TypeOfWidget {
      return widgetStore.type as TypeOfWidget;
    },
    setData,
  };
};
