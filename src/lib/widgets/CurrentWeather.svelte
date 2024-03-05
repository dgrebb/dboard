<script>
  import { Card } from 'flowbite-svelte';
  import Barometer from 'svelte-weather/Barometer.svelte';
  export let weather;
</script>

<Card size="xl" class="relative">
  <Barometer size="50" class="mb-3 self-end text-gray-500 dark:text-gray-400" />
  <h2>Lansdale</h2>
  <h1 class="mt-auto justify-end text-9xl text-blue-500">
    {Math.round(weather.current)}<span class="text-gray-50">&deg;</span>
  </h1>
</Card>
