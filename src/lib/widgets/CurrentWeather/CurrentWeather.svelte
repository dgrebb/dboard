<script lang="ts">
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import type { CurrentWeather } from '$lib/types';

  export let weatherData: CurrentWeather;
  $: weather = weatherData satisfies CurrentWeather;

  $: ({
    temperature_2m: current,
    weather_code: weatherCode,
    is_day: day,
  } = weather);
  $: highlightColor = fahrenheitToColorShade(current);
  $: isDay = day === 1;

  onMount(() => {
    switch (isDay) {
      case true:
        document.documentElement.classList.toggle('light', true);
        document.documentElement.classList.toggle('dark', false);
        localStorage.setItem('color-theme', 'light');
        break;

      default:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('color-theme', 'dark');
        break;
    }
  });
</script>

<div transition:fade class="card-container relative">
  {#key weather}
    <Card
      size="xl"
      class="dboard__card"
      style={`--text-color: ${highlightColor}`}
    >
      <h2>Lansdale</h2>
      <WeatherIcon {weatherCode} {isDay} />
      <h1
        class="dboard__card--value-lg mt-auto justify-end text-9xl text-[var(--text-color)] brightness-75 dark:saturate-200"
      >
        {Math.round(current)}<span
          class="dboard__card__value-symbol text-[var(--text-color)] brightness-150 dark:brightness-150"
          >&deg;</span
        >
      </h1>
    </Card>
  {/key}
</div>
