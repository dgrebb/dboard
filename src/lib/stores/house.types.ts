export interface Light {
  state: object;
  type: string;
  name: string;
}

export interface Group {
  name: string;
  lights: string[];
  state: object;
  action: object;
}

export interface LightInfo {
  state: {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    effect: string;
    xy: [number, number];
    ct: number;
    alert: string;
    colormode: string;
    mode: string;
    reachable: boolean;
  };
  type: string;
  name: string;
}

export type FilteredLights = LightInfo[];

export interface GroupState {
  all_on: boolean;
  any_on: boolean;
}

export interface GroupAction {
  on: boolean;
  bri: number;
  hue?: number;
  sat?: number;
  effect?: string;
  xy?: [number, number];
  ct?: number;
  alert: string;
  colormode?: string;
}

export interface GroupInfo {
  id: string;
  name: string;
  lights: string[];
  state: GroupState;
  action: GroupAction;
}

export type FilteredGroups = GroupInfo[];

export interface HouseType {
  lights?: FilteredLights;
  groups?: FilteredGroups;
}

export interface SensorState {
  lastupdated: string;
  [key: string]: unknown;
}

export interface SensorInfo {
  id: string;
  state: SensorState;
  name: string;
  type: string;
}

export type FilteredSensors = SensorInfo[];
