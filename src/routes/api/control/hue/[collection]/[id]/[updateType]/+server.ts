import { json } from '@sveltejs/kit';
import {
  SECRET_HUE_IP_ADDRESS,
  SECRET_HUE_USERNAME,
} from '$env/static/private';

import type { RequestHandler } from './$types';
import type { FetchOptions } from '@types';

export const PUT: RequestHandler = async ({
  fetch,
  request,
  params: { collection, id, updateType },
}) => {
  const state = await request.json();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const requestOptions: FetchOptions = {
    method: 'PUT',
    redirect: 'follow',
    body: JSON.stringify({
      ...state,
      transitiontime: 50,
      effect: null,
      ct: null,
      alert: null,
      colormode: null,
      mode: null,
      reachable: null,
    }),
  };
  const requestURL = `https://${SECRET_HUE_IP_ADDRESS}/api/${SECRET_HUE_USERNAME}/${collection}${id ? `/${id}` : ''}${updateType ? `/${updateType}` : ''}`;
  await fetch(requestURL, requestOptions)
    .then((response) => response.json())
    .then((result) => console.info(result))
    .catch((error) => console.error(error));
  return json({ success: true });
};
