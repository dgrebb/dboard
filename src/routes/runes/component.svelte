<script>
  // @ts-nocheck
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import { createWeather } from '$root/lib/stores';
  import { counter } from './location.svelte';
</script>

<div>
  <h1>Get some Weather</h1>
  <button onclick={(e) => weather.loadWeather(LATITUDE, LONGITUDE)}
    >Do it.</button
  >
  <h1>Bump the counter. You already have {counter.count} times before.</h1>
  <button onclick={counter.increment}>Plus it.</button>
</div>

<style>
  /* your styles go here */
</style>
