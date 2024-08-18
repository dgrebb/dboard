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
}) satisfies RequestHandler;
