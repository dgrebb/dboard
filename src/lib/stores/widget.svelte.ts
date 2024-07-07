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
  let widgetStore = $state<WidgetData>({
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
      return widgetStore;
    },
    get getData(): PossibleWidgetData | undefined {
      return widgetStore.data;
    },
    get type(): TypeOfWidget {
      return widgetStore.type;
    },
    setData,
  };
};
