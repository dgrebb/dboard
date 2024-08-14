import { json } from '@sveltejs/kit';
import {
  SECRET_HUE_IP_ADDRESS,
  SECRET_HUE_USERNAME,
} from '$env/static/private';
import type {
  FetchOptions,
  FilteredGroups,
  FilteredLights,
  FilteredSensors,
  Group,
  Light,
  SensorState,
} from '@types';

const filterLights = (lights: Record<string, Light>): FilteredLights => {
  return Object.keys(lights).map((id) => {
    const { state, type, name } = lights[id];

    return {
      id,
      name,
      state,
      type,
    };
  }) as FilteredLights;
};

const filterGroups = (groups: Record<string, Group>): FilteredGroups => {
  return Object.keys(groups).map((id) => {
    const { name, lights, state, action } = groups[id] as Group;
    return { id, name, lights, state, action };
  });
};

function filterSensors(sensors: Record<string, unknown>): FilteredSensors {
  return Object.keys(sensors).map((id) => {
    const sensor = sensors[id] as {
      state: SensorState;
      name: string;
      type: string;
    };
    return { id, state: sensor.state, name: sensor.name, type: sensor.type };
  });
}

import type { RequestHandler } from './$types';

export const prerender = false;

export const GET = (async ({ fetch, params: { collection } }) => {
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  let apiResponse;

  await fetch(
    `https://${SECRET_HUE_IP_ADDRESS}/api/${SECRET_HUE_USERNAME}/${collection}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => (apiResponse = result))
    .catch((error) => console.error(error));

  const filterMap = {
    lights: filterLights,
    groups: filterGroups,
    sensors: filterSensors,
  } as const;

  if (apiResponse && collection in filterMap) {
    apiResponse = filterMap[collection as keyof typeof filterMap](apiResponse);
  }

  return json({ success: true, data: apiResponse });
}) satisfies RequestHandler;
