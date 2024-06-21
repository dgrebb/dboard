import {
  isNightScoutData,
  type ChartSeriesGlucose,
  type NightScoutData,
} from '../types';

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

export const mapNightScoutColors = (currentReading: number) => {
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
};

export const extractBGValues = (data: ChartSeriesGlucose[]) => {
  return data.map((item) => item.sgv);
};
