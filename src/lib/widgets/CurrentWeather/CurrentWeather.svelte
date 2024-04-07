<script lang="ts">
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
    is_day: isDay,
  } = $weather);
  $: highlightColor = fahrenheitToColorShade(current);
</script>

<div transition:fade class="dboard__grid__item relative">
  {#key weather}
    <div
      class="dboard__card border-none bg-transparent"
      style={`--mainColor: ${highlightColor}`}
    >
      <h2 class="text-[var(--mainColor)] brightness-75 dark:saturate-200">
        Lansdale
      </h2>
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
