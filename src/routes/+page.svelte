<script lang="ts">
  import { DEFAULT_REFRESH_INTERVAL, LATITUDE, LONGITUDE } from '$lib/GLOBALS';
  import Main from './(layouts)/Main.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { ArrowUpDownOutline, XCircleOutline } from 'flowbite-svelte-icons';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import CurrentWeather from '$lib/widgets/CurrentWeather/CurrentWeather.svelte';
  import BloodGlucose from '$lib/widgets/BloodGlucose/BloodGlucose.svelte';
  import updateBackgroundColorGradient from '$lib/background';
  import { time } from '$lib/store';

  import type { ChartSeriesGlucose, DBoardItem } from '$lib/types';

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

  // export let data;
  let items: DBoardItem[] = [];
  let weatherData: CurrentWeather;

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
    const { weatherData } = await res.json();

    return weatherData;
  };

  const closeSocket = () => {
    ws?.close();
  };

  onMount(async () => {
    nightscoutData();
    weatherData = await fetchWeatherData();
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    setInterval(async () => {
      nightscoutData();
      weatherData = await fetchWeatherData();
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
  <div slot="additional-controls">
    <Button
      size="sm"
      disabled={!webSocketEstablished}
      color="dark"
      class="border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
      on:click={closeSocket}><XCircleOutline /></Button
    >

    <Button
      size="sm"
      disabled={webSocketEstablished}
      color="dark"
      class="border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
      on:click={() => establishWebSocket()}><ArrowUpDownOutline /></Button
    >
  </div>

  <div class="grid grid-cols-3 gap-3 p-8">
    {#each items as { title, content: { small: { value: label }, large: { value: mainDisplayValue } }, series: data }}
      <BloodGlucose {data} {label} {mainDisplayValue} />
    {/each}
    {#if weatherData}
      <CurrentWeather {weatherData} />
    {/if}
  </div>

  <div slot="countdown-bar">
    <ProgressBar {refreshInterval} {seconds} />
  </div>
</Main>
