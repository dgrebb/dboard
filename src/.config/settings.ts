import widgets from '$root/.config/settings.json';
import type {
  LocationData,
  LocationsType,
  TypeOfWidget,
} from '$root/lib/types';
import type { ComponentType } from 'svelte';

export const glu = {
  hoursDisplayed: 1, // in hours
};

export const hue = {
  actions: [
    {
      light: {
        name: 'Home',
        id: 81,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Living Room',
        id: 1,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Trees',
        id: 32,
        on: false,
        actionType: 'lights',
      },
    },
    {
      light: {
        name: 'Kitchen',
        id: 9,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Bedroom',
        id: 2,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Office',
        id: 3,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Vinyl',
        id: 10,
        on: false,
        actionType: 'groups',
      },
    },
    {
      light: {
        name: 'Front Door',
        id: 7,
        on: false,
        actionType: 'groups',
      },
    },
  ],
};

export const locations: LocationsType = {
  home: {
    timezone: 'America/New_York',
    primary: true,
    latitude: 40.2415,
    longitude: -75.2838,
    name: 'Lansdale, PA',
  },
  jamestown: {
    timezone: 'America/Denver',
    primary: false,
    latitude: 40.1155,
    longitude: 105.3886,
    name: 'Jamestown, CO',
  },
};

export type SettingsType = {
  location: Location;
  tempo: number;
  widgets: TypeOfWidget[];
};

export type CurrentWeatherSettings = {
  location: LocationData;
  tempo: number;
};

// types.d.ts
export interface Location {
  primary: boolean;
  name: string;
  latitude: number;
  longitude: number;
}
