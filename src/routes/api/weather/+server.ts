import { json } from '@sveltejs/kit';
import { WEATHER_API, WEATHER_LAT_LONG } from '$lib/GLOBALS';
import type { RequestHandler } from './$types';
import type { FetchOptions } from '$lib/types';

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

  // TODO: refactor for open-meto
  // https://open-meteo.com/en/docs/#current=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1
  const [weather] = await Promise.all([
    fetch(
      `${WEATHER_API}/forecast?${WEATHER_LAT_LONG}&current=temperature_2m&hourly=temperature_2m,is_day&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1&daily=weather_code`,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.error(error)),
  ]);

  const now: Date = new Date();
  const currentHourDaytime: number =
    await weather.hourly.is_day[now.getHours()];
  const isDay: boolean = currentHourDaytime === 1 ? true : false;

  return json({
    success: true,
    weather: {
      current: weather.current.temperature_2m,
      weatherCode: weather.daily.weather_code,
      isDay,
    },
  });

  return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;
