import { json } from '@sveltejs/kit';
import { SECRET_AUDIO_CONTROL_IP_ADDRESS } from '$env/static/private';

import type { RequestHandler } from './$types';
import type { FetchOptions } from '$root/lib/types';

export const prerender = false;

export const GET = (async ({ fetch, params: { command } }) => {
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  await fetch(
    `https://${SECRET_AUDIO_CONTROL_IP_ADDRESS}/httpapi.asp?command=setPlayerCmd:${command}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

  return json({ success: true });
}) satisfies RequestHandler;
