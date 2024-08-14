import type { Group, Light, SensorInfo } from './house.types';

export interface HouseState {
  lights: Record<string, Light>;
  groups: Record<string, Group>;
  sensors: Record<string, SensorInfo>;
}

export const createHouseState = () => {
  let houseState: HouseState = $state({
    lights: {},
    groups: {},
    sensors: {},
  });

  return {
    setHouseState: (state: HouseState) => {
      houseState = state;
    },

    setLights: (lights: HouseState['lights']) => {
      houseState = {
        ...houseState,
        lights: {
          ...houseState.lights,
          ...lights,
        },
      };
    },

    setGroups: (groups: HouseState['groups']) => {
      houseState = {
        ...houseState,
        groups: {
          ...houseState.groups,
          ...groups,
        },
      };
    },

    setSensors: (sensors: HouseState['sensors']) => {
      houseState = {
        ...houseState,
        sensors: {
          ...houseState.sensors,
          ...sensors,
        },
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
      houseState.lights[id].state.on = onState;
    },
  };
};

export const houseState = createHouseState();
