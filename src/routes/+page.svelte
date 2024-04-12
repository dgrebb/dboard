<script lang="ts">
  import { DEFAULT_REFRESH_INTERVAL, LATITUDE, LONGITUDE } from '$lib/GLOBALS';
  import Main from './(layouts)/Main.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { ArrowUpDownOutline, XCircleOutline } from 'flowbite-svelte-icons';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import CurrentWeather from '$lib/components/widgets/CurrentWeather/CurrentWeather.svelte';
  import BloodGlucose from '$lib/components/widgets/BloodGlucose/BloodGlucose.svelte';
  import CurrentMusic from '$lib/components/widgets/CurrentMusic/CurrentMusic.svelte';
  import updateBackgroundColorGradient from '$lib/background';
  import time from '$lib/stores/time';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';

  import type {
    ChartSeriesGlucose,
    CurrentWeatherType,
    DBoardItem,
    WeatherData,
  } from '$lib/types';
  import Controls from '$lib/components/Controls/Controls.svelte';

  let refreshInterval = DEFAULT_REFRESH_INTERVAL;
  let seconds = 0;
  let webSocketEstablished = false;
  let ws: WebSocket | null = null;
  let log: string[] = [];

  const establishWebSocket = () => {
    console.log('connecting', webSocketEstablished);
    if (webSocketEstablished) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
    ws.addEventListener('open', (event) => {
      webSocketEstablished = true;
      console.log('[websocket] connection open', event);
      logEvent('[websocket] connection open');
    });
    ws.addEventListener('close', (event) => {
      webSocketEstablished = false;
      console.log('[websocket] connection closed', event);
      logEvent('[websocket] connection closed');
    });
    ws.addEventListener('message', (event) => {
      console.log('[websocket] message received', event);
      logEvent(`[websocket] message received: ${event.data}`);
    });
  };

  let items: DBoardItem[] = [];
  let weatherData: CurrentWeatherType;

  const logEvent = (str: string) => {
    log = [...log, str];
  };

  const nightscoutData = async () => {
    const res = await fetch('/api/nightscout');
    const data = await res.json();
    const { nightscout } = data;
    items = nightscout.items;
  };

  const fetchWeatherData = async () => {
    const res = await fetch('/api/weather');
    const { weatherData, solarData } = await res.json();

    $weather = weatherData;
    $solar = solarData;

    nightDay(weatherData.is_day);
  };

  const closeSocket = () => {
    ws?.close();
  };

  export const nightDay = async (isDay) => {
    if (isDay !== undefined) {
      switch (isDay) {
        case 1:
          document.documentElement.classList.toggle('light', true);
          document.documentElement.classList.toggle('dark', false);
          localStorage.setItem('color-theme', 'light');
          // console.log(isDay, 'day');
          break;

        case 0:
          document.documentElement.classList.toggle('light', false);
          document.documentElement.classList.toggle('dark', true);
          localStorage.setItem('color-theme', 'dark');
          // console.log(isDay, 'night');
          break;

        default:
          document.documentElement.classList.toggle('light', false);
          document.documentElement.classList.toggle('dark', true);
          localStorage.setItem('color-theme', 'dark');
          // console.log(isDay, 'night');
          break;
      }
    }
  };

  onMount(async () => {
    nightscoutData();
    fetchWeatherData();
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    setInterval(async () => {
      nightscoutData();
      fetchWeatherData();
      updateBackgroundColorGradient(LATITUDE, LONGITUDE);
      seconds = 0;
    }, refreshInterval);

    setInterval(() => {
      seconds++;
      let now = new Date();
      $time = now.getHours() * 60 + now.getMinutes();
    }, 1000);
  });
</script>

<Main>
  <Controls
    {webSocketEstablished}
    on:closeSocket={closeSocket}
    on:establishWebSocket={establishWebSocket}
  />

  <div class="dboard__grid">
    {#each items as { title, content: { small: { value: label }, large: { value: mainDisplayValue } }, series: data }}
      <BloodGlucose {data} {label} {mainDisplayValue} />
    {/each}
    {#if $weather}
      <CurrentWeather />
    {/if}
    <CurrentMusic />
  </div>

  <div class="dboard__grid">
    {#each items as { title, content: { small: { value: label }, large: { value: mainDisplayValue } }, series: data }}
      <BloodGlucose {data} {label} {mainDisplayValue} />
    {/each}
    {#if $weather}
      <CurrentWeather />
    {/if}
    <CurrentMusic />
  </div>

  <div slot="countdown-bar">
    <ProgressBar {refreshInterval} {seconds} />
  </div>
</Main>
