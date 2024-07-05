<script lang="ts">
  import type { WeatherData, WeatherSettings } from '$lib/types';
  import {
    background,
    createOldManWeather,
    homeState,
    timeState,
  } from '$lib/stores';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { blur, fade } from 'svelte/transition';
  import '$widgets/Weather/weather.css';
  import fahrenheitToColorShade from '$utils/temperatureColor';
  import WeatherIcon from '$widgets/Weather/WeatherIcon.svelte';

  let highlightColor = fahrenheitToColorShade(77);
  let pushing = $state(false);
  let refreshed = $state(true);
  const { settings }: Props = $props();
  const {
    location,
    location: { name, timeZone },
  } = settings;
  let weather = createOldManWeather();
  let current: WeatherData['current'] | undefined = $state(weather.current());
  let daily: WeatherData['daily'] | undefined = $state(weather.daily());
  let globalIsDay: number | undefined = $state(undefined);
  let clock: string = $state(timeState.hoursMinutesString(timeZone));

  function handlePushing(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = true;
    refreshed = false;
  }

  function handleUp(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = false;

    weather.loadWeather(location);
  }

  type Props = {
    settings: WeatherSettings;
  };

  const nightOverride = (isDay: number, localDay: number) => {
    return localDay === 1 && isDay === 0;
  };
  const dayOverride = (isDay: number, localDay: number) => {
    return localDay === 0 && isDay === 1;
  };

  onMount(async () => {
    await weather.loadWeather(location);
    weather.setTempo(900000, location);
    if (
      location.primary === true &&
      typeof daily === 'object' &&
      typeof current === 'object'
    ) {
      await homeState.setLocation(location);
      await background.updateColor(current, daily);
      await homeState.setWeather({
        success: true,
        current,
        daily,
      });
    }
  });

  $effect(() => {
    daily = weather.daily();
    current = weather.current();
    if (globalIsDay === undefined) {
      setTimeout(async () => {
        globalIsDay = await homeState.globalIsDay();
      }, 100);
    }
    if (
      location.primary === true &&
      typeof daily === 'object' &&
      typeof current === 'object'
    ) {
      background.updateColor(current, daily);
    }
  });

  $effect(() => {
    clock = timeState.hoursMinutesString(timeZone);
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
  {#if current && globalIsDay !== undefined}
    <div
      class="dboard__card border-none bg-transparent"
      class:pushing
      class:refreshed
      transition:fade
      class:night-override={nightOverride(current?.is_day, globalIsDay)}
      class:day-override={dayOverride(current?.is_day, globalIsDay)}
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

<style>
  .push-to-refresh {
    .dboard__card {
      transform-origin: center;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      &:before {
        position: absolute;
        opacity: 0.5;
        z-index: 10;
        transition: 333ms opacity cubic-bezier(0.175, 0.885, 0.32, 1.275);
        inset: 0;
        content: '';
      }
      &.pushing {
        transform: scale3d(0.77, 0.77, 0.77);
        background-color: rgba(255, 255, 255, 0.8);
      }
      &.refreshed {
        &:before {
          opacity: 0;
        }
      }
    }
  }
</style>
