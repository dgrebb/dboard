import { json } from '@sveltejs/kit';
import { WEATHER_API, WEATHER_LAT_LONG } from '$lib/GLOBALS';
import type { RequestHandler } from './$types';
import type { FetchOptions, WeatherData } from '$lib/types';

export const GET = (async ({ url, locals }) => {
  if (locals.wss) {
    locals.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          `Hello from the GET handler at ${new Date().toLocaleString()}`
        );
      }
    });
  }

  // call server for data
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const weather: WeatherData = await fetch(
    `${WEATHER_API}/forecast?${WEATHER_LAT_LONG}&current=temperature_2m,cloud_cover,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset&timezone=America%2FNew_York`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));

  return json({
    success: true,
    weatherData: weather.current,
    solarData: weather.daily,
  });

  return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;
