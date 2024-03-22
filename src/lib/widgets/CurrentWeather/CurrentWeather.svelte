<script lang="ts">
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  import WeatherIcon from './WeatherIcon.svelte';
  import { onMount } from 'svelte';
  export let weather: {
    current: number;
    weatherCode: number;
    isDay: boolean;
  };

  $: ({ current, weatherCode, isDay } = weather);

  onMount(() => {
    ({ current, weatherCode, isDay } = weather);
  });
</script>

{#if current}
  <div transition:fade class="card-container relative">
    <Card size="xl">
      <h2>Lansdale</h2>
      <WeatherIcon {weatherCode} {isDay} />
      <h1
        class="mt-auto justify-end text-9xl"
        style={`color: ${fahrenheitToColorShade(current)}`}
      >
        {Math.round(current)}<span class="text-gray-50">&deg;</span>
      </h1>
    </Card>
  </div>
{/if}
