import type { LocationType } from '$root/lib/types';

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

export const locations: LocationType = {
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
