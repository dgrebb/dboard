import type { Load } from '@sveltejs/kit';
import { weather } from '$root/lib/stores/weather.svelte';
import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';

export const load: Load = async function load({ url }) {
  const host = url.origin;
  weather.loadWeather(LATITUDE, LONGITUDE, host);
  // weather.setRefreshInterval(5000, LATITUDE, LONGITUDE, host);

  return {
    weather: {
      current: weather.current,
      daily: weather.daily,
    },
  };
};
