import type {
  WeatherData,
  FetchOptions,
  LocationType,
  CurrentWeatherData,
  Timer,
} from '../types';
// import { counter } from '$root/routes/runes/location.svelte';

export const createOldManWeather = function createWeather() {
  let weather = $state({
    success: false,
    current: undefined,
    daily: undefined,
  });
  let tempoId: number | Timer | null;

  async function getWeather(
    location: LocationType,
    host: string = ''
  ): Promise<WeatherData | void> {
    const { latitude, longitude, timeZone } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const weatherData: WeatherData | void = await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,cloud_cover,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timeZone}`,
      requestOptions
    )
      .then(function (res) {
        return res.json();
      })
      .then((json: { weather: WeatherData }) => {
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
    const { latitude, longitude, timeZone } = location;
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    await fetch(
      `${host}/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,cloud_cover,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timeZone}`,
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
      loadWeather(location);
    }, time);
  }

  return {
    current: (): CurrentWeatherData | undefined => {
      return typeof weather.current === 'object' ? weather.current : undefined;
    },

    daily: () => {
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
