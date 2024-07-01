<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade, blur } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import type { CurrentWeatherSettings } from '$root/.config/settings';
  import { createWeather, homeState } from '$root/lib/stores';
  import type { WeatherData } from '$lib/types';
  import { background } from '$root/lib/stores';
  import './current-weather.css';

  let highlightColor = fahrenheitToColorShade(77);
  let pushing = $state(false);
  let refreshed = $state(true);
  let mounted = $state(false);
  const { settings }: Props = $props();
  const {
    location,
    location: { name },
  } = settings;
  let weather = createWeather();
  let current: WeatherData['current'] | boolean = $derived(weather.current);
  let daily: WeatherData['daily'] | boolean = $derived(weather.daily);

  let solarData = $state(homeState.solarData());
  let { isDay: globalIsDay } = $state(solarData);

  function handlePushing() {
    pushing = true;
    refreshed = false;
  }

  function handleUp() {
    const fakeWeatherUpdateLocation = {
      primary: false,
      timezone: 'America/Denver',
      latitude: 40.1155,
      longitude: 105.3886,
      name: 'Jamestown, CO',
    };
    pushing = false;

    weather.loadWeather(fakeWeatherUpdateLocation);
  }

  type Props = {
    settings: CurrentWeatherSettings;
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
    mounted = true;
  });

  $effect(() => {
    let daily = $state.snapshot(weather.daily);
    let current = $state.snapshot(weather.current);
    if (
      location.primary === true &&
      typeof daily === 'object' &&
      typeof current === 'object'
    ) {
      background.updateColor(current, daily);
      return () => {
        homeState.setWeather({
          success: true,
          current,
          daily,
        });
      };
    }
  });
</script>

{#if typeof current !== 'boolean' && current?.is_day !== undefined}
  <div
    onmousedown={handlePushing}
    onmouseup={handleUp}
    tabindex="-1"
    role="button"
    style={`--mainColor: ${highlightColor}`}
    class={`dboard__grid__item push-to-refresh current-weather ${current.is_day === 1 && globalIsDay === 0 ? 'current-weather-day' : ''} ${current.is_day === 0 && globalIsDay === 1 ? 'current-weather-night' : ''} relative`}
  >
    {#if current}
      <div
        class="dboard__card border-none bg-transparent"
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
              weatherCode={current.weather_code}
              isDay={current.is_day}
            />
          </span>
        {/key}
        {#key current.temperature_2m}
          <h1
            class="dboard__card--value-lg current-temperature mt-auto justify-end text-9xl text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
            in:blur={{ duration: 333, delay: 335 }}
            out:blur={{ duration: 333, delay: 0 }}
          >
            {Math.round(current.temperature_2m)}<span
              class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
              >&deg;</span
            >
          </h1>
        {/key}
      </div>
    {/if}
  </div>
{/if}

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
