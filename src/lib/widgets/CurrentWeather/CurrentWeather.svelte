<script lang="ts">
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import type { CurrentWeather } from '$lib/types';

  export let weather: CurrentWeather;

  $: ({
    temperature_2m: current,
    weather_code: weatherCode,
    is_day: day,
  } = weather);
  $: highlightColor = fahrenheitToColorShade(current);
  $: isDay = day === 1;

  onMount(() => {
    if (localStorage.getItem('color-theme')) return false;
    switch (isDay) {
      case true:
        document.documentElement.classList.toggle('light', true);
        document.documentElement.classList.toggle('dark', false);
        break;

      default:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        break;
    }
  });
</script>

<div transition:fade class="card-container relative">
  {#key current}
    <Card
      size="xl"
      class="dboard__card"
      style={`--text-color: ${highlightColor}`}
    >
      <h2>Lansdale</h2>
      <WeatherIcon {weatherCode} {isDay} />
      <h1
        class="dboard__card--value-lg dark:brightness-175 mt-auto justify-end text-9xl text-[var(--text-color)] brightness-125"
      >
        {Math.round(current)}<span
          class="dboard__card__value-symbol text-[var(--text-color)] brightness-125 dark:brightness-150"
          >&deg;</span
        >
      </h1>
    </Card>
  {/key}
</div>
