import type { FetchOptions, LocationType } from '../types';
// import { counter } from '$root/routes/runes/location.svelte';

export type WeatherType = {
  current: {
    apparent_temperature: number;
    temperature_2m: number;
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
  let weather: WeatherType | boolean = $state(false);
  let tempoId: number | NodeJS.Timeout | null;

  async function getWeather(
    location: LocationType,
    host: string = ''
  ): Promise<WeatherType | void> {
    const { latitude, longitude, timezone } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const weatherData: WeatherType | void = await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timezone}`,
      requestOptions
    )
      .then(function (res) {
        return res.json();
      })
      .then((json: { weather: WeatherType }) => {
        return json.weather;
      })
      .catch(function (err) {
        console.error(err);
      });

    if (weatherData) {
      return weatherData;
    }
  }

  async function loadWeather(
    location: LocationType,
    host: string = ''
  ): Promise<void> {
    const { latitude, longitude, timezone } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timezone}`,
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

  function setTempo(time: number, location: LocationType) {
    if (tempoId) {
      clearInterval(tempoId);
    }
    tempoId = setInterval(function () {
      console.log('intervalling');
      loadWeather(location);
    }, time);
  }

  return {
    get current() {
      if (typeof weather === 'object') {
        return weather.current;
      } else {
        return weather;
      }
    },
    get daily() {
      if (typeof weather === 'object') {
        return weather.daily;
      } else {
        return weather;
      }
    },
    getWeather,
    loadWeather,
    setTempo,
  };
};

// export const weather = createWeather();
