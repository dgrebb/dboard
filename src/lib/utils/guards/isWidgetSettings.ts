import type { WidgetSettings } from '$types';
import { isLocationSettings } from '$guards';

export const isWidgetSettings = (widget: unknown): widget is WidgetSettings => {
  const wgt = widget as WidgetSettings;
  return (
    typeof wgt.type === 'string' &&
    (!wgt.name || typeof wgt.name === 'string') &&
    (!wgt.settings ||
      (wgt.settings &&
        (!wgt.settings.location || isLocationSettings(wgt.settings.location))))
  );
};
