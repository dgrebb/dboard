<script lang="ts">
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  import type { CurrentWeather } from '$lib/types';

  export let weather: CurrentWeather;

  $: ({ current, weatherCode, isDay } = weather);
  $: highlightColor = fahrenheitToColorShade(current);
</script>

<div transition:fade class="card-container relative">
  {#key current}
    <Card size="xl" class="dboard__card">
      <h2>Lansdale</h2>
      <WeatherIcon {weatherCode} {isDay} />
      <h1
        class="mt-auto justify-end text-9xl"
        style={`color: ${highlightColor}`}
      >
        {Math.round(current)}<span class="text-gray-50">&deg;</span>
      </h1>
    </Card>
  {/key}
</div>
