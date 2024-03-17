<script lang="ts">
  import fahrenheitToColorShade from './tempColor';
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  export let weather: {
    current: number;
  };

  $: currentTemp = weather.current;
</script>

{#if currentTemp}
  <div transition:fade class="card-container relative">
    <Card size="xl">
      <Barometer
        size="50"
        class="mb-3 self-end text-gray-500 dark:text-gray-400"
      />
      <h2>Lansdale</h2>
      <h1
        class="mt-auto justify-end text-9xl"
        style={`color: ${fahrenheitToColorShade(currentTemp)}`}
      >
        {Math.round(currentTemp)}<span class="text-gray-50">&deg;</span>
      </h1>
    </Card>
  </div>
{/if}
