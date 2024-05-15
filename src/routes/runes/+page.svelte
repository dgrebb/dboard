<script lang="ts">
  import '$lib/styles/app.pcss';
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import updateBackgroundColorGradient from '$root/lib/layout/background';
  import { DarkMode } from 'flowbite-svelte';
  import createLocation from './location.svelte';
  import { createCounter } from './location.svelte';
  import { onMount } from 'svelte';
  import { setTime } from './runedHelpers';
  import Component from './component.svelte';
  import { fade } from 'svelte/transition';
  import { weather } from '$root/lib/stores/weather.svelte';

  onMount(() => {
    weather.loadWeather(LATITUDE, LONGITUDE);
  });
</script>

<div>
  <h1>Hello.</h1>
  {#if weather.current}<h2>
      The current temperature is: {weather.current.apparent_temperature}
    </h2>{/if}
  <Component />
</div>
