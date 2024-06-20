import { mapNightScoutDirectionIcon } from '../_helpers/directionIconMap';
import {
  type HealthData,
  type NightScoutData,
  type NightScoutReading,
} from '../types';

const createHealthStore = () => {
  let healthStore: HealthData = $state({
    nightScout: false,
  });

  const getCurrentData = (): NightScoutReading | false => {
    if (healthStore.nightScout && healthStore.nightScout.length) {
      const current: NightScoutReading = healthStore.nightScout[0];
      return current;
    } else {
      console.log(`NightScout data loading...`);
      return false;
    }
  };

  const getLastData = (): NightScoutReading | false => {
    if (healthStore.nightScout) {
      const current: NightScoutReading = healthStore.nightScout[1];
      return current;
    } else {
      console.log(`NightScout data loading...`);
      return false;
    }
  };

  const getDifference = (): string | number => {
    if (healthStore.nightScout) {
      const current: number = healthStore.nightScout[0].sgv;
      const last: number = healthStore.nightScout[1].sgv;
      const difference = current - last;
      return difference > 0 ? `+${difference}` : difference;
    } else {
      return 0;
    }
  };

  const getDirectionIcon = function getDirectionIcon(): string {
    const data = healthStore.nightScout;
    let icon = 'iconamoon:cloud-error-light';
    icon = mapNightScoutDirectionIcon(data);
    return icon;
  };

  return {
    data: () => healthStore,
    getCurrentData,
    getDifference,
    getDirectionIcon,
    getLastData,
    getNightScoutData: () => healthStore.nightScout,
    setHealthData: (healthData: HealthData) => (healthStore = healthData),
    setNightScout: (data: NightScoutData) => (healthStore.nightScout = data),
  };
};

export const healthState = createHealthStore();
