import { json } from '@sveltejs/kit';
import {
  SECRET_HUE_IP_ADDRESS,
  SECRET_HUE_USERNAME,
} from '$env/static/private';

import type { RequestHandler } from './$types';
import type { FetchOptions } from '@types';

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
