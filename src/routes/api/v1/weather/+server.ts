import { json } from '@sveltejs/kit';
import { WEATHER_API, WEATHER_LAT_LONG } from '$root/.config/GLOBALS';
import type { RequestHandler } from './$types';
import type { FetchOptions, WeatherData } from '$lib/types';

export const prerender = false;

function setTempo(locals, time) {
  setInterval(async function () {
    const weather = await fetchWeather();

    if (locals.wss) {
      locals.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          // client.send(`Weather update — at ${new Date().toLocaleString()}`);
          client.send(
            JSON.stringify({
              success: true,
              weatherData: weather.current,
              solarData: weather.daily,
            })
          );
        }
      });
    }
  }, time);
}

async function fetchWeather() {
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const weather: WeatherData = await fetch(
    `${WEATHER_API}/forecast?${WEATHER_LAT_LONG}&current=apparent_temperature,temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,temperature_2m,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset&timezone=America%2FNew_York`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));

  return weather;
}

export const GET = (async ({ url, locals }) => {
  // call server for data
  const weather = await fetchWeather();
  // console.log('🚀 ~ GET ~ weather:', weather);
  // setTempo(locals, 300000);

  if (weather) {
    return json({
      success: true,
      weatherData: weather.current,
      solarData: weather.daily,
    });
  } else {
    return json({
      success: false,
      weatherData: {
        time: '2024-06-06T14:45',
        interval: 900,
        apparent_temperature: 3.33,
        temperature_2m: 233,
        wind_speed_10m: 11.7,
        wind_direction_10m: 239,
        wind_gusts_10m: 19.9,
        cloud_cover: 100,
        is_day: 1,
        weather_code: 3,
      },
      solarData: {
        time: [
          '2024-06-06',
          '2024-06-07',
          '2024-06-08',
          '2024-06-09',
          '2024-06-10',
          '2024-06-11',
          '2024-06-12',
        ],
        sunrise: [
          '2024-06-06T05:31',
          '2024-06-07T05:31',
          '2024-06-08T05:31',
          '2024-06-09T05:31',
          '2024-06-10T05:31',
          '2024-06-11T05:31',
          '2024-06-12T05:31',
        ],
        sunset: [
          '2024-06-06T20:28',
          '2024-06-07T20:28',
          '2024-06-08T20:29',
          '2024-06-09T20:29',
          '2024-06-10T20:30',
          '2024-06-11T20:30',
          '2024-06-12T20:31',
        ],
      },
    });
  }
}) satisfies RequestHandler;
