import { mapNightScoutDirectionIcon } from '@utils/nightscout';
import {
  type HealthData,
  type NightScoutData,
  type NightScoutReading,
} from '@types';

export const createHealthState = () => {
  let healthStore: HealthData = $state({
    nightScout: false,
  });

  const getCurrentData = (): NightScoutReading | false => {
    if (healthStore.nightScout && healthStore.nightScout.length) {
      const current: NightScoutReading = healthStore.nightScout[0];
      return current;
    } else {
      console.info(`NightScout data loading...`);
      return false;
    }
  };

  const getLastData = (): NightScoutReading | false => {
    if (healthStore.nightScout) {
      const current: NightScoutReading = healthStore.nightScout[1];
      return current;
    } else {
      console.info(`NightScout data loading...`);
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

  const getDirectionIcon = (): string => {
    const data: NightScoutData | false = healthStore.nightScout || false;
    return mapNightScoutDirectionIcon(data);
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

export const healthState = createHealthState();
