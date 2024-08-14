import type { FilteredGroups, FilteredLights, FilteredSensors } from '@types';

export interface HouseState {
  lights: FilteredLights;
  groups: FilteredGroups;
  sensors: FilteredSensors;
}

export const createHouseState = () => {
  let houseState: HouseState = $state({
    lights: [] as FilteredLights,
    groups: [] as FilteredGroups,
    sensors: [] as FilteredSensors,
  });

  return {
    setHouseState: (state: HouseState) => {
      houseState = state;
    },

    setLights: (lights: HouseState['lights']) => {
      houseState = {
        ...houseState,
        lights: [...houseState.lights, ...lights],
      };
    },

    setGroups: (groups: HouseState['groups']) => {
      houseState = {
        ...houseState,
        groups: [...houseState.groups, ...groups],
      };
    },

    setSensors: (sensors: HouseState['sensors']) => {
      houseState = {
        ...houseState,
        sensors: [...houseState.sensors, ...sensors],
      };
    },

    getLights: () => {
      return houseState.lights;
    },

    getGroups: () => {
      return houseState.groups;
    },

    getSensors: () => {
      return houseState.sensors;
    },

    getSensor: (id: string) => {
      if (Array.isArray(houseState.sensors)) {
        const sensor = houseState.sensors.find((sensor) => sensor.id === id);
        if (sensor) return sensor.state;
      }
      return undefined;
    },

    setLightOn: async (id: string, onState: boolean) => {
      const headers = new Headers();
      const raw = JSON.stringify({
        on: onState,
      });
      const requestOptions: RequestInit = {
        method: 'PUT',
        headers,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      };
      await fetch(`/api/control/hue/lights/${id}/state`, requestOptions);

      const light = houseState.lights.find((light) => light.id === id);
      if (light) {
        light.state.on = onState;
      }
    },
  };
};

export const houseState = createHouseState();
