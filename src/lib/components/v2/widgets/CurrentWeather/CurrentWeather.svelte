<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade, blur } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import { weather, type WeatherType } from '$root/lib/stores';
  import { onMount } from 'svelte';
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import { locations } from '$root/.config/settings';

  let current = $state(weather.current);
  let highlightColor = fahrenheitToColorShade(77);
  let pushing = $state(false);
  let refreshed = $state(true);

  function handlePushing() {
    pushing = true;
    refreshed = false;
  }

  $effect(() => {
    if (weather) {
      current = weather.current;
      refreshed = true;
    }
  });

  function handleUp() {
    pushing = false;
    weather.loadWeather(
      locations.jamestown.latitude,
      locations.jamestown.longitude
    );
  }
</script>

{#key weather}
  <div
    onmousedown={handlePushing}
    onmouseup={handleUp}
    tabindex="-1"
    role="button"
    class="dboard__grid__item push-to-refresh current-weather relative transition-colors"
  >
    {#if current}
      <div
        class="dboard__card border-none bg-transparent"
        style={`--mainColor: ${highlightColor}`}
        class:pushing
        class:refreshed
      >
        <h2
          class="text-[var(--mainColor)] brightness-75 dark:saturate-200"
          out:blur={{ duration: 333 }}
          in:blur={{ delay: 333, duration: 333 }}
        >
          Lansdale
          <Icon
            icon="ei:arrow-up"
            class="current-weather__wind-direction inline-block mix-blend-darken brightness-50 dark:brightness-200"
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
            class="text-sm text-[var(--mainColor)] brightness-50 dark:brightness-150"
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
          {Math.round(current.apparent_temperature)}<span
            class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
            >&deg;</span
          >
        </h1>
      </div>
    {/if}
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
