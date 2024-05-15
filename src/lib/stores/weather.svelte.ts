import type { FetchOptions } from '../types';

export interface WeatherType {
  current: {
    feelsLike: string;
    weatherCode: string;
    windSpeed: string;
    windDirection: string;
    windGusts: string;
    isDay: number;
  };
  daily: {
    [key: string]: string | boolean | number;
  };
}

export const createWeather = function createWeather() {
  let weather = $state({});

  async function loadWeather(latitude: string, longitude: string) {
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    // console.log('🚀 ~ updateFrequency:', updateFrequency);
    await fetch(
      `/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset&timezone=America%2FNew_York`,
      requestOptions
    )
      .then(function (res) {
        return res.json();
      })
      .then((json) => {
        weather = json.weather;
        console.log(weather.current);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  return {
    get current() {
      return weather.current;
    },
    loadWeather,
  };
};

export const weather = createWeather();
