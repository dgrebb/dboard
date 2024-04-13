<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import weather from '$lib/stores/weather';

  $: ({
    temperature_2m: current,
    weather_code: weatherCode,
    wind_speed_10m: windSpeed,
    wind_direction_10m: windDirection,
    wind_gusts_10m: windGust,
    is_day: isDay,
  } = $weather);
  $: highlightColor = fahrenheitToColorShade(current);
  $: touched = false;

  function handleTouched() {
    touched = !touched;
  }
</script>

<div
  on:click={handleTouched}
  on:keydown={handleTouched}
  tabindex="-1"
  transition:fade
  role="button"
  class="dboard__grid__item current-weather relative border-4 transition-colors {touched
    ? `border-blue-800`
    : `border-transparent`}"
>
  {#key weather}
    <div
      class="dboard__card border-none bg-transparent"
      style={`--mainColor: ${highlightColor}`}
    >
      <h2 class="text-[var(--mainColor)] brightness-75 dark:saturate-200">
        Lansdale
        <Icon
          icon="ei:arrow-up"
          class="current-weather__wind-direction inline-block mix-blend-darken"
          width={33}
          style={`transform: rotate(${(windDirection + 180) % 360}deg); filter: brightness(33%)`}
          color={highlightColor}
        />
      </h2>
      <div class="current-weather__wind">
        <p class="text-sm">
          {windSpeed} ↝ {windGust}mph
        </p>
      </div>
      <WeatherIcon {weatherCode} {isDay} />
      <h1
        class="dboard__card--value-lg mt-auto justify-end text-9xl text-[var(--mainColor)] brightness-75 dark:saturate-200"
      >
        {Math.round(current)}<span
          class="dboard__card__value-symbol text-[var(--mainColor)] brightness-150 dark:brightness-150"
          >&deg;</span
        >
      </h1>
    </div>
  {/key}
</div>
