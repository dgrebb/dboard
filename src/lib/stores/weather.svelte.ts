import type { FetchOptions, LocationType } from '../types';
import { counter } from '$root/routes/runes/location.svelte';

export type WeatherType = {
  current: {
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    is_day: number;
  };
  daily: {
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrises: number[];
    sunsets: number[];
    time: string[];
    weather_code: string[];
  };
};

export const createWeather = function createWeather() {
  // const initial = getWeather(location, host);
  let weather: WeatherType = $state({});
  let tempoId: number | NodeJS.Timeout | null;

  async function getWeather(
    location: LocationType,
    host: string = ''
  ): Promise<WeatherType> {
    const { latitude, longitude } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const weatherData: WeatherType = await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=America%2FNew_York`,
      requestOptions
    )
      .then(function (res) {
        return res.json();
      })
      .then((json) => {
        return json.weather;
      })
      .catch(function (err) {
        console.error(err);
      });

    return weatherData;
  }

  async function loadWeather(
    location: LocationType,
    host: string = ''
  ): Promise<void> {
    const { latitude, longitude } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=America%2FNew_York`,
      requestOptions
    )
      .then(function (res) {
        return res.json();
      })
      .then((json) => {
        weather = json.weather;
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function setTempo(time: number, latitude: number, longitude: number) {
    if (tempoId) {
      clearInterval(tempoId);
    }
    tempoId = setInterval(function () {
      console.log('intervalling');
      counter.increment();
      loadWeather(latitude, longitude);
    }, time);
  }

  return {
    get current() {
      return weather.current;
    },
    get daily() {
      return weather.daily;
    },
    getWeather,
    loadWeather,
    setTempo,
  };
};

export const weather = createWeather();
