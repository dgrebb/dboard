<script lang="ts">
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import Main from '../(layouts)/Main.svelte';
  import { onMount } from 'svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import CurrentWeather from '$lib/components/v2/widgets/CurrentWeather/CurrentWeather.svelte';
  import BloodGlucose from '$lib/components/widgets/BloodGlucose/BloodGlucose.svelte';
  import CurrentMusic from '$lib/components/widgets/CurrentMusic/CurrentMusic.svelte';
  import updateBackgroundColorGradient from '$lib/layout/background';
  import time from '$lib/stores/time';
  // import weather from '$root/lib/stores/weatherLeg';
  import { weather, background } from '$root/lib/stores';
  import solar from '$lib/stores/solar';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';

  import { conduct } from '../runes/maestro.svelte';

  let mounted = $state(false);
  let refreshInterval = DEFAULT_TEMPO;
  let seconds = 0;
  // let webSocketEstablished = false;
  // let ws: WebSocket | null = null;
  // let log: string[] = [];
  // let schedule: SeptaDataNextToArrive[];
  let schedule = $state();
  // $: console.log('🚀 ~ schedule:', schedule);

  const establishWebSocket = () => {
    // console.log('connecting', webSocketEstablished);
    if (webSocketEstablished) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
    ws.addEventListener('open', (event) => {
      webSocketEstablished = true;
      // console.log('[websocket] connection open', event);
      logEvent('[websocket] connection open');
    });
    ws.addEventListener('close', (event) => {
      webSocketEstablished = false;
      // console.log('[websocket] connection closed', event);
      logEvent('[websocket] connection closed');
    });
    ws.addEventListener('message', (event) => {
      // console.log('[websocket] message received', event);
      logEvent(`[websocket] message received: ${event.data}`);
    });
  };

  let items: DBoardItem[] = [];
  // let weatherData: CurrentWeatherType;

  const logEvent = (str: string) => {
    log = [...log, str];
  };

  const nightscoutData = async () => {
    const res = await fetch('/api/v1/nightscout');
    const data = await res.json();
    const { nightscout } = data;
    items = nightscout.items;
  };

  // const fetchWeatherData = async () => {
  //   const res = await fetch('/api/v1/weather');
  //   const { weatherData, solarData } = await res.json();

  //   $weather = weatherData;
  //   $solar = solarData;

  //   nightDay(weatherData.is_day);
  // };

  const fetchSeptaNextToArrive = async () => {
    const data = await fetch('/api/v1/septa', { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => console.error(err));
    schedule = data.schedule;
    // console.log('🚀 ~ fetchSeptaNextToArrive ~ schedule:', schedule);
  };

  const closeSocket = () => {
    ws?.close();
  };

  onMount(async () => {
    await conduct(LATITUDE, LONGITUDE);
    mounted = true;

    nightscoutData();
    // fetchWeatherData();
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    fetchSeptaNextToArrive();
    setInterval(async () => {
      nightscoutData();
      // fetchWeatherData();
      fetchSeptaNextToArrive();
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

{#if mounted}
  <Main>
    <div class="dboard__grid" use:pullToRefresh>
      <!-- {#each items as { title, content: { small: { value: label, direction }, large: { value: mainDisplayValue } }, series: data }}
      {#if direction}
      <BloodGlucose {data} {label} {mainDisplayValue} {direction} />
      {/if}
      {/each} -->
      {#if weather.current}
        <CurrentWeather current={weather.current} />
      {/if}
      <!-- <CurrentMusic /> -->
    </div>

    <div class="dboard__grid">
      <!-- <SeptaNextToArrive {schedule} /> -->
      <div class="dboard__grid__item control-widget">
        <div class="dboard__card">
          <!-- <OnOff /> -->
          <!-- <Restart /> -->
        </div>
      </div>
    </div>

    <div slot="countdown-bar">
      <ProgressBar {refreshInterval} {seconds} />
    </div>
  </Main>
{/if}
