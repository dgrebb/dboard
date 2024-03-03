<script lang="ts">
  import Main from './(layouts)/Main.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { Card } from 'flowbite-svelte';
  import { ArrowUpDownOutline, XCircleOutline } from 'flowbite-svelte-icons';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Grid from '$lib/components/Grid.svelte';

  let refreshInterval = 300000;
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

  interface Item {
    requestInterval: number;
    title: string;
    content: {
      small: {
        value: string;
        color: string;
      };
      large: {
        value: string;
        color: string;
      };
    };
  }

  interface Hour {
    number?: number;
    name?: string;
    startTime?: string;
    endTime?: string;
    isDaytime?: boolean;
    temperature: number;
  }

  // export let data;
  let items: Item[] = [];
  let weather: Hour[] = [];

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

  <ProgressBar {refreshInterval} {seconds} slot="countdown-bar" />

  <Grid />

  <div class="grid grid-cols-3 gap-3 p-8">
    {#each items as { title, content: { small, large } }}
      <Card size="fit">
        <h2>{title}</h2>
        <h1 class="text-7xl">{large.value}</h1>
        <p>{small.value}</p>
      </Card>
    {/each}
    {#if weather}
      <Card size="fit">
        <h2>Lansdale</h2>
        <h1 class="text-7xl">{Math.ceil(weather.current)}</h1>
        <!-- <p>{weather[1].temperature}</p>
					<p>{weather[2].temperature}</p>
					<p>{weather[3].temperature}</p>
					<p>{weather[4].temperature}</p>
				-->
      </Card>
    {/if}
  </div>
</Main>

<style>
  h1 {
    color: red;
  }
  Main {
    font-family: sans-serif;
  }
</style>
