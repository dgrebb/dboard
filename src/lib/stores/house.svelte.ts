// import type {} from '$lib/types';
// import type {
//   Light,
//   Group,
//   FilteredLights,
//   FilteredGroups,
//   FilteredSensors,
//   SensorState,
// } from '@types';

import type { GroupInfo, LightInfo, SensorInfo } from './house.types';

// export const filterLights = (
//   lights: Record<string, unknown>
// ): FilteredLights => {
//   return Object.keys(lights).map((id) => {
//     const { state, type, name } = lights[id] as Light;
//     return { id, state, type, name };
//   });
// };

// export const filterGroups = (
//   groups: Record<string, unknown>
// ): FilteredGroups => {
//   return Object.keys(groups).map((id) => {
//     const { name, lights, state, action } = groups[id] as Group;
//     return { id, name, lights, state, action };
//   });
// };

// export function filterSensors(
//   sensors: Record<string, unknown>
// ): FilteredSensors {
//   return Object.keys(sensors).map((id) => {
//     const sensor = sensors[id] as {
//       state: SensorState;
//       name: string;
//       type: string;
//     };
//     return { id, state: sensor.state, name: sensor.name, type: sensor.type };
//   });
// }

// export const getInitialLights

export interface HouseState {
  lights: Record<string, LightInfo>;
  groups: Record<string, GroupInfo>;
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

    getLights: () => {
      return houseState.lights;
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
