<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade, blur } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import { weather, type WeatherType } from '$root/lib/stores';
  import { onMount } from 'svelte';
  import type { CurrentWeatherType } from '$root/lib/types';
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';

  type Props = {
    current: WeatherType['current'];
  };

  interface CurrentWeatherInterface {
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    is_day: number;
  }

  let { current }: Props = $props();

  let {
    apparent_temperature,
    weather_code,
    wind_speed_10m,
    wind_direction_10m,
    wind_gusts_10m,
    is_day,
  } = current;
  let highlightColor = fahrenheitToColorShade(77);
  let unique: {} = $state({});
  let pushing = $state(false);
  let refreshed = $state(true);

  function handlePushing() {
    pushing = true;
    refreshed = false;
  }

  $effect(() => {
    refreshed = current ? true : false;
  });

  function handleUp() {
    pushing = false;
    weather.loadWeather(LATITUDE, LONGITUDE);
  }
</script>

{#key unique}
  <div
    onmousedown={handlePushing}
    onmouseup={handleUp}
    tabindex="-1"
    out:blur={{ duration: 333 }}
    in:blur={{ delay: 333, duration: 333 }}
    role="button"
    class="dboard__grid__item push-to-refresh current-weather relative transition-colors"
  >
    {#key current}
      <div
        class="dboard__card border-none bg-transparent"
        style={`--mainColor: ${highlightColor}`}
        class:pushing
        class:refreshed
      >
        <h2 class="text-[var(--mainColor)] brightness-75 dark:saturate-200">
          Lansdale
          <Icon
            icon="ei:arrow-up"
            class="current-weather__wind-direction inline-block mix-blend-darken brightness-50 dark:brightness-200"
            width={27}
            style={`transform: rotate(${(wind_direction_10m + 222) % 360}deg);`}
            color={highlightColor}
          />
        </h2>
        <div class="current-weather__wind">
          <p
            class="text-sm text-[var(--mainColor)] brightness-50 dark:brightness-150"
          >
            {wind_speed_10m} ↝ {wind_gusts_10m}mph
          </p>
        </div>
        {#key is_day}
          <WeatherIcon weatherCode={weather_code} isDay={is_day} />
        {/key}
        <h1
          class="dboard__card--value-lg mt-auto justify-end text-9xl text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
        >
          {Math.round(apparent_temperature)}<span
            class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
            >&deg;</span
          >
        </h1>
      </div>
    {/key}
  </div>
{/key}

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
