import { json } from '@sveltejs/kit';
import { WEATHER_API } from '$root/.config/GLOBALS';
import type { RequestHandler } from '@sveltejs/kit';
import type { FetchOptions } from '$lib/types';
import type { WeatherType } from '$lib/stores';

export const GET = (async ({ url, params }) => {
  // console.log('🚀 ~ GET ~ url:', url);
  // call server for data
  const query: string = url.search;
  const { endpoint } = params;
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const weather: WeatherType = await fetch(
    `${WEATHER_API}/${endpoint}${query}`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));

  return json({
    success: true,
    weather,
  });

  return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;
