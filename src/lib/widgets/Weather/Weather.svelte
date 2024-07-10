<script lang="ts">
  import type {
    CurrentWeatherData,
    DailyWeatherData,
    WeatherSettings,
  } from '$lib/types';
  import {
    isCurrentWeatherData,
    isDailyWeatherData,
    TypeOfWidget,
  } from '$lib/types';
  import { createWeatherWidget } from '$lib/widgets/Weather/weatherStore.svelte';
  import { background, homeState, timeState } from '$root/lib/stores';
  import { generateID, toCamelCase } from '$utils/strings';
  import fahrenheitToColorShade from '$utils/temperatureColor';
  import Icon from '@iconify/svelte';
  import { onDestroy, onMount } from 'svelte';
  import { blur, fade } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import '$widgets/Weather/weather.css';

  type Props = {
    settings: WeatherSettings;
  };

  const { settings }: Props = $props();
  const {
    location,
    location: { name, latitude, longitude, timeZone },
  } = settings;

  const widgetName = 'Current Weather';
  const id = generateID(widgetName);
  const path = toCamelCase(widgetName);
  const refreshInterval = 900000;
  const resubscribeInterval = 3600000; // Resubscribe every hour
  const upstreamAPIURL = `/api/v2/weather/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,apparent_temperature,temperature_2m,cloud_cover,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&daily=sunrise,sunset,weather_code,apparent_temperature_max,apparent_temperature_min&timezone=${timeZone}`;

  let resubscribeTimeout: number;
  let retryTimeout: number;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  const weatherWidget = createWeatherWidget(
    TypeOfWidget.Weather,
    widgetName,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let current: CurrentWeatherData | undefined = $state(weatherWidget.current());
  let daily: DailyWeatherData | undefined = $state(weatherWidget.daily());
  let temperature: CurrentWeatherData['temperature_2m'] | undefined = $state(
    weatherWidget.currentRoundTemperature()
  );
  let clock: string = $state(timeState.hoursMinutesString(timeZone));
  let pushing = $state(false);
  let refreshed = $state(true);
  let highlightColor = $state(fahrenheitToColorShade(77));

  async function setupEventSource() {
    if (eventSource) {
      eventSource.close();
    }

    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    eventSource = new EventSource(
      `/api/stream/${path}?name=${widgetName}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    eventSource.onmessage = async (event) => {
      const { weather } = JSON.parse(event.data);
      await weatherWidget.setData(weather);
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
        setupEventSource();
      }, retryDelay) as unknown as number;
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = window.setInterval(() => {
      setupEventSource();
    }, resubscribeInterval);
  }

  function stopEventSource() {
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

  onMount(async () => {
    await setupEventSource();
    window.addEventListener('beforeunload', handleWindowUnload);
  });

  function handleWindowUnload() {
    console.info('Handling window unload...');
    stopEventSource();
  }

  const handlePushing = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = true;
    refreshed = false;
  };

  const handleUp = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = false;

    current = weatherWidget.current();

    // Reload EventSource
    stopEventSource();
    setupEventSource();
  };

  $effect(() => {
    current = weatherWidget.current();
    daily = weatherWidget.daily();
    temperature = weatherWidget.currentRoundTemperature() || 77;
    highlightColor = fahrenheitToColorShade(temperature);
    if (isCurrentWeatherData(current) && isDailyWeatherData(daily)) {
      background.updateColor(current, daily);
    }

    return () => {
      if (
        location.primary === true &&
        isCurrentWeatherData(current) &&
        isDailyWeatherData(daily)
      ) {
        homeState.setLocation(location);
        homeState.setWeather({
          success: true,
          current,
          daily,
        });
      }
    };
  });

  $effect(() => {
    clock = timeState.hoursMinutesString(timeZone);
  });

  onDestroy(() => {
    stopEventSource();
    window.removeEventListener('beforeunload', handleWindowUnload);
  });
</script>

<div
  onmousedown={(e) => handlePushing(e)}
  onmouseup={(e) => handleUp(e)}
  ontouchstart={(e) => handlePushing(e)}
  ontouchend={(e) => handleUp(e)}
  tabindex="-1"
  role="button"
  style={`--mainColor: ${highlightColor}`}
  class="dboard__grid__item push-to-refresh current-weather relative"
>
  {#if current}
    <div
      class={`dboard__card border-none bg-transparent ${current?.is_day === 0 ? 'night' : 'day'}`}
      class:pushing
      class:refreshed
      transition:fade
    >
      <h2
        class="brightness-25 text-[var(--mainColor)] bg-blend-darken dark:saturate-200"
      >
        {name}
        {#key current.wind_direction_10m}
          <span
            in:blur={{ duration: 333, delay: 335 }}
            out:blur={{ duration: 333, delay: 0 }}
          >
            <Icon
              icon="ei:arrow-up"
              class="current-weather__wind-direction brightness-25 inline-block mix-blend-darken dark:brightness-200"
              width={27}
              style={`transform: rotate(${(current.wind_direction_10m + 222) % 360}deg);`}
              color={highlightColor}
            />
          </span>
        {/key}
      </h2>
      {#key current.wind_speed_10m}
        <div
          class="current-weather__wind"
          in:blur={{ duration: 333, delay: 335 }}
          out:blur={{ duration: 333, delay: 0 }}
        >
          <p
            class="brightness-25 text-sm text-[var(--mainColor)] dark:brightness-150"
          >
            {current.wind_speed_10m} ↝ {current.wind_gusts_10m}mph
          </p>
        </div>
      {/key}

      {#key current.weather_code}
        <span
          in:blur={{ duration: 333, delay: 335 }}
          out:blur={{ duration: 333, delay: 0 }}
        >
          <WeatherIcon
            weatherCode={typeof current.weather_code === 'number'
              ? current.weather_code
              : 0}
            isDay={current.is_day}
          />
        </span>
      {/key}
      <div class="lower-card">
        {#key current.temperature_2m}
          <h1
            class="dboard__card--value-lg current-temperature text-9xl text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
            in:blur={{ duration: 333, delay: 335 }}
            out:blur={{ duration: 333, delay: 0 }}
          >
            {Math.round(current.temperature_2m)}<span
              class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
              >&deg;</span
            >
          </h1>
          {#if location.primary === false}
            <div
              class="local-time text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
            >
              {clock}
            </div>
          {/if}
        {/key}
      </div>
    </div>
  {/if}
</div>
