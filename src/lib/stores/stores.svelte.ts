import type { FetchOptions } from '../types';
import { nightDay } from '../_helpers/nightDay';
import updateBackgroundColorGradient from '$root/lib/layout/background';
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
    sunrise: number[];
    sunset: number[];
    time: string[];
    weather_code: string[];
  };
};

export const createWeather = function createWeather() {
  let weather: WeatherType | null = $state(null);
  let tempoId: number | NodeJS.Timeout | null;

  async function loadWeather(
    latitude: string,
    longitude: string,
    host: string = ''
  ): Promise<void> {
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

  function setTempo(time: number, latitude: string, longitude: string) {
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
      return weather?.current || null;
    },
    get daily() {
      return weather?.daily || null;
    },
    loadWeather,
    setTempo,
  };
};

export const weather = createWeather();

export const createBackground = function createBackground() {
  let tempoId: number | NodeJS.Timeout | null;

  function updateColor(latitude: string, longitude: string) {
    nightDay(weather.current?.is_day);
    updateBackgroundColorGradient(latitude, longitude);
  }

  function setTempo(time: number, latitude: string, longitude: string) {
    if (tempoId) {
      clearInterval(tempoId);
    }
    tempoId = setInterval(function () {
      updateColor(latitude, longitude);
    }, time);
  }

  return {
    updateColor,
    setTempo,
  };
};

export const background = createBackground();
