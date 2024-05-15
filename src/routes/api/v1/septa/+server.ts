import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FetchOptions, SeptaDataNextToArrive } from '$lib/types';

export const GET = (async ({ url }) => {
  const headers = new Headers();
  headers.append('accept', 'application/json');

  const requestOptions: FetchOptions = {
    method: 'GET',
    headers,
    redirect: 'follow',
  };

  const schedule: SeptaDataNextToArrive = await fetch(
    'https://www3.septa.org/api/NextToArrive/index.php?req1=Pennbrook&req2=Suburban%20Station&req3=5',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));

  return json({
    success: true,
    schedule,
  });

  return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;
