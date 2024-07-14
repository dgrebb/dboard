import { json } from '@sveltejs/kit';
import { WEATHER_API } from '$root/.config/GLOBALS';
import type { RequestHandler } from '@sveltejs/kit';
import type { FetchOptions, WeatherData } from '$types';

export const GET = (async ({ url, params }) => {
  const query: string = url.search;
  const { endpoint } = params;
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const weather: WeatherData = await fetch(
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
