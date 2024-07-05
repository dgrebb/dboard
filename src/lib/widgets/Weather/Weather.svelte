<script lang="ts">
  import { browser } from '$app/environment';
  import type { WeatherSettings } from '$lib/types';
  import { TypeOfWidget } from '$lib/types';
  import { createWeatherWidget } from '$lib/widgets/Weather/weatherStore.svelte';
  import { generateID, toCamelCase } from '$utils/strings';
  import '$widgets/weather/weather.css';
  import { onDestroy, onMount } from 'svelte';

  type Props = {
    settings: WeatherSettings;
  };

  const { settings }: Props = $props();
  const {
    location: { name, latitude, longitude, timeZone },
  } = settings;

  const widgetName = 'Current Weather';
  const id = generateID(widgetName);
  const path = toCamelCase(widgetName);
  const upstreamAPIURL = `/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,cloud_cover,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timeZone}`;
  const refreshInterval = 60000;
  const resubscribeInterval = 3600000; // Resubscribe every hour
  let resubscribeTimeout: number;
  let retryTimeout: number;
  let retryCount = 0;
  let host = browser ? window.location.hostname : '';
  console.log('🚀 ~ host:', host);

  let eventSource: EventSource | null = null;
  const weatherWidget = createWeatherWidget(
    TypeOfWidget.Weather,
    widgetName,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let temperature = $state(0);

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    eventSource = new EventSource(
      `/api/stream/${path}?name=${widgetName}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );
    console.log(
      '🚀 ~ startSubscription ~',
      `${host}/api/stream/${path}?name=${widgetName}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      weatherWidget.setData(data);
      retryCount = 0; // Reset retry count on successful message
    };

    eventSource.onerror = (error) => {
      console.info('EventSource error:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = window.setTimeout(() => {
        startSubscription();
      }, retryDelay) as unknown as number;
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = window.setInterval(() => {
      startSubscription();
    }, resubscribeInterval);
  }

  onMount(async () => {
    await startSubscription();
    window.addEventListener('beforeunload', handleWindowUnload);
  });

  function handleWindowUnload() {
    console.info('Handling window unload...');
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  }

  $effect(() => {
    temperature = weatherWidget.currentRoundTemperature();
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  });
</script>

<div class="current-weather text-white">
  <h1>{name}</h1>
  <h2>{temperature}</h2>
</div>
