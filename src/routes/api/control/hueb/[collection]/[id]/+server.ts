import { json } from '@sveltejs/kit';
import {
  SECRET_HUE_IP_ADDRESS,
  SECRET_HUE_USERNAME,
} from '$env/static/private';

import type { RequestHandler } from './$types';
import type {
  FetchOptions,
  // FilteredGroups,
  // FilteredLights,
  // FilteredSensors,
  // Group,
  // Light,
  // SensorState,
} from '@types';

// const filterLights = (lights: Record<string, Light>): FilteredLights => {
//   return Object.keys(lights).map((id) => {
//     const { state, type, name } = lights[id];

//     return {
//       id,
//       name,
//       state,
//       type,
//     };
//   }) as FilteredLights;
// };

// const filterGroups = (groups: Record<string, Group>): FilteredGroups => {
//   return Object.keys(groups).map((id) => {
//     const { name, lights, state, action } = groups[id] as Group;
//     return { id, name, lights, state, action };
//   });
// };

// function filterSensors(sensors: Record<string, unknown>): FilteredSensors {
//   return Object.keys(sensors).map((id) => {
//     const sensor = sensors[id] as {
//       state: SensorState;
//       name: string;
//       type: string;
//     };
//     return { id, state: sensor.state, name: sensor.name, type: sensor.type };
//   });
// }

export const prerender = false;

export const GET = (async ({ fetch, params: { collection, id } }) => {
  const requestURL = `https://${SECRET_HUE_IP_ADDRESS}/api/${SECRET_HUE_USERNAME}/${collection}${id ? `/${id}` : ''}`;

  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  let apiResponse;

  await fetch(requestURL, requestOptions)
    .then((response) => response.json())
    .then((result) => (apiResponse = result))
    .catch((error) => console.error(error));

  console.log('🚀 ~ GET ~ apiResponse:', apiResponse);
  return json({ success: true, apiResponse });
  // console.log('you got me bro');
}) satisfies RequestHandler;

export const PUT = (async ({ fetch, params: { collection, id } }) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const requestOptions: FetchOptions = {
    method: 'PUT',
    redirect: 'follow',
    body: JSON.stringify({
      on: false,
    }),
  };
  const requestURL = `https://${SECRET_HUE_IP_ADDRESS}/api/${SECRET_HUE_USERNAME}/${collection}${id ? `/${id}` : ''}${collection === 'lights' ? `/state` : `/action`}`;
  await fetch(requestURL, requestOptions)
    .then((response) => response.text())
    .then((result) => console.info(result))
    .catch((error) => console.error(error));
  return json({ success: true });
}) satisfies RequestHandler;
