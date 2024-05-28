import widgets from '$root/.config/settings.json';
import type { LocationsType } from '$root/lib/types';
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
    latitude: '40.2415',
    longitude: '-75.2838',
    name: 'Lansdale, PA',
  },
  jamestown: {
    latitude: '40.1155',
    longitude: '105.3886',
    name: 'Jamestown, CO',
  },
};

type SettingsType = {
  widgets: WidgetType[];
  overrideTheme?: 'dark' | 'light';
};

type WidgetType = {
  type: string;
  settings: CurrentWeatherSettings;
};

export type CurrentWeatherSettings = {
  location: {
    primary: boolean;
    latitude: number;
    longitude: number;
    name: string;
  };
  tempo: number;
};

// types.d.ts
export interface Location {
  primary: boolean;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Settings {
  location: Location;
  tempo: number;
}

export interface Widget {
  type: string;
  settings: Settings;
}

export interface WidgetsConfig {
  widgets: Widget[];
}
