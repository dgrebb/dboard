import type { FetchOptions } from '../types';

export type WeatherType = {
  current: {
    apparent_temperature: string;
    weatherCode: string;
    windSpeed: string;
    windDirection: string;
    windGusts: string;
    is_day: number;
  };
  daily: {
    weather_code: string[];
    time: string[];
  };
};

export const createWeather = function createWeather() {
  let weather: WeatherType | null = $state(null);

  async function loadWeather(
    latitude: string,
    longitude: string,
    host: string = ''
  ) {
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    // console.log('🚀 ~ updateFrequency:', updateFrequency);
    await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code&timezone=America%2FNew_York`,
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

  function setRefreshInterval(
    time: number,
    latitude: string,
    longitude: string,
    host?: string
  ) {
    setInterval(function () {
      loadWeather(latitude, longitude, host);
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
    setRefreshInterval,
  };
};

export const weather = createWeather();
