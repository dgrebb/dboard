import type {
  FilteredGroups,
  FilteredLights,
  FilteredSensors,
  GroupAction,
  LightAction,
} from '@types';

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

    setGroupOn: async (id: string, onState: boolean) => {
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
      await fetch(`/api/control/hue/groups/${id}/action`, requestOptions);

      const group = houseState.groups.find((group) => group.id === id);
      if (group) {
        group.state.any_on = onState;
        group.state.all_on = onState;
      }
    },

    setLightState: async (id: string, lightState: LightAction) => {
      const headers = new Headers();
      const raw = JSON.stringify({
        ...lightState,
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
        light.state = {
          ...light.state,
          ...lightState,
        };
      }
    },

    setGroupState: async (id: string, state: GroupAction) => {
      const headers = new Headers();
      const raw = JSON.stringify({
        ...state,
      });
      const requestOptions: RequestInit = {
        method: 'PUT',
        headers,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      };
      await fetch(`/api/control/hue/groups/${id}/action`, requestOptions);

      const group = houseState.groups.find((group) => group.id === id);
      if (group) {
        group.state = {
          ...group.state,
          ...state,
        };
      }
    },
  };
};

export const houseState = createHouseState();
