<script>
  // @ts-nocheck
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import { weather } from '$lib/stores/weather.svelte';
</script>

<div>
  <h1>Get some Weather</h1>
  <button onclick={(e) => weather.loadWeather(LATITUDE, LONGITUDE)}
    >Do it.</button
  >
</div>

<style>
  /* your styles go here */
</style>
