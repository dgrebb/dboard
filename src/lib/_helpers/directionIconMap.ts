import { isNightScoutData, type NightScoutData } from '../types';

export const mapNightScoutDirectionIcon = (
  data: NightScoutData | false = false
): string => {
  let icon = 'iconamoon:cloud-error-light';
  if (isNightScoutData(data)) {
    switch (data[0].direction) {
      case 'SingleUp':
        icon = 'ph:arrow-up-right-light';
        break;
      case 'Up':
        icon = 'ph:trend-up-light';
        break;
      case 'FortyFiveUp':
        icon = 'ph:arrow-bend-right-up-light';
        break;
      case 'Flat':
        icon = 'material-symbols-light:trending-flat';
        break;
      case 'Down':
        icon = 'ph:trend-down-light';
        break;
      case 'FortyFiveDown':
        icon = 'ph:arrow-bend-right-down-light';
        break;
    }
  }
  return icon;
};
