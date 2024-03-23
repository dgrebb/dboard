<script lang="ts">
  import { DEFAULT_REFRESH_INTERVAL } from '$lib/GLOBALS';
  import Main from './(layouts)/Main.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { ArrowUpDownOutline, XCircleOutline } from 'flowbite-svelte-icons';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import CurrentWeather from '$lib/widgets/CurrentWeather/CurrentWeather.svelte';
  import BloodGlucose from '$lib/widgets/BloodGlucose/BloodGlucose.svelte';

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
  let weather: CurrentWeather[] | boolean = false;

  const logEvent = (str: string) => {
    log = [...log, str];
  };

  const nightscoutData = async () => {
    const res = await fetch('/api/nightscout');
    const data = await res.json();
    const { nightscout } = data;
    items = nightscout.items;
  };

  const weatherData = async () => {
    const res = await fetch('/api/weather');
    const { weather } = await res.json();

    return weather;
  };

  const closeSocket = () => {
    ws?.close();
  };

  onMount(async () => {
    nightscoutData();
    weather = await weatherData();
    setInterval(async () => {
      nightscoutData();
      weather = await weatherData();
      seconds = 0;
    }, refreshInterval);

    setInterval(() => {
      seconds++;
    }, 1000);
  });
</script>

<Main>
  <div slot="additional-controls">
    <Button
      size="sm"
      color="light"
      disabled={!webSocketEstablished}
      on:click={closeSocket}><XCircleOutline /></Button
    >

    <Button
      size="sm"
      color="light"
      disabled={webSocketEstablished}
      on:click={() => establishWebSocket()}><ArrowUpDownOutline /></Button
    >
  </div>

  <div class="grid grid-cols-3 gap-3 p-8">
    {#each items as { title, content: { small: { value: label }, large: { value: mainDisplayValue } }, series: data }}
      <BloodGlucose {data} {label} {mainDisplayValue} />
    {/each}
    {#if weather}
      <CurrentWeather {weather} />
    {/if}
  </div>

  <div slot="countdown-bar">
    <ProgressBar {refreshInterval} {seconds} />
  </div>
</Main>
