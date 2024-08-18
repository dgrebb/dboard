export interface Light {
  state: LightState;
  type: string;
  name: string;
}

export type FilteredLights = (Light & { id: string })[];

export interface LightState {
  on: boolean;
  bri: number;
  xy: [number, number];
}

export interface GroupState {
  all_on: boolean;
  any_on: boolean;
}

export interface LightAction {
  on: boolean;
  bri?: number;
  xy?: [number, number];
}

export interface GroupAction {
  on: boolean;
  bri?: number;
  xy?: [number, number];
}

export interface Group {
  name: string;
  lights: string[];
  state: GroupState;
  action: LightAction;
}

export type FilteredGroups = (Group & { id: string })[];

export interface HouseType {
  lights?: FilteredLights;
  groups?: FilteredGroups;
}

export interface SensorState {
  lastupdated: string;
  temperature?: number;
  [key: string]: unknown;
}

export interface Sensor {
  state: SensorState;
  name: string;
  type: string;
}

export type FilteredSensors = (Sensor & { id: string })[];
