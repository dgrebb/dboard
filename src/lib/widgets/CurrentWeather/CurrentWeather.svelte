<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade, blur } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import type { CurrentWeatherSettings } from '$root/.config/settings';
  import { createWeather, type WeatherType } from '$root/lib/stores';
  import { background } from '$root/lib/stores';

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
  let current: WeatherType['current'] | boolean = $derived(weather.current);
  let daily: WeatherType['daily'] | boolean = $derived(weather.daily);

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
    }
  });
</script>

{#if mounted}
  <div
    onmousedown={handlePushing}
    onmouseup={handleUp}
    tabindex="-1"
    role="button"
    transition:fade
    style={`--mainColor: ${highlightColor}`}
    class="dboard__grid__item push-to-refresh current-weather relative transition-colors"
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
          out:blur={{ duration: 333 }}
          in:blur={{ delay: 333, duration: 333 }}
        >
          {name}
          <Icon
            icon="ei:arrow-up"
            class="current-weather__wind-direction brightness-25 inline-block mix-blend-darken dark:brightness-200"
            width={27}
            style={`transform: rotate(${(current.wind_direction_10m + 222) % 360}deg);`}
            color={highlightColor}
          />
        </h2>
        <div
          class="current-weather__wind"
          out:blur={{ duration: 333 }}
          in:blur={{ delay: 333, duration: 333 }}
        >
          <p
            class="brightness-25 text-sm text-[var(--mainColor)] dark:brightness-150"
          >
            {current.wind_speed_10m} ↝ {current.wind_gusts_10m}mph
          </p>
        </div>
        {#key current.is_day}
          <WeatherIcon
            weatherCode={current.weather_code}
            isDay={current.is_day}
          />
        {/key}
        <h1
          class="dboard__card--value-lg mt-auto justify-end text-9xl text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
          out:blur={{ duration: 333 }}
          in:blur={{ delay: 333, duration: 333 }}
        >
          {Math.round(current.temperature_2m)}<span
            class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
            >&deg;</span
          >
        </h1>
      </div>
    {/if}
  </div>
{/if}

<style>
  .push-to-refresh {
    .dboard__card {
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-origin: center;
      &:before {
        position: absolute;
        content: '';
        transition: 333ms opacity cubic-bezier(0.175, 0.885, 0.32, 1.275);
        inset: 0;
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.8);
        opacity: 0.5;
      }
      &.pushing {
        transform: scale3d(0.77, 0.77, 0.77);
      }
      &.refreshed {
        &:before {
          opacity: 0;
        }
      }
    }
  }
</style>
