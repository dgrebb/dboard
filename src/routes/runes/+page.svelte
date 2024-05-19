<script lang="ts">
  import '$lib/styles/app.pcss';
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import updateBackgroundColorGradient from '$root/lib/layout/background';
  import { onMount } from 'svelte';
  import { setTime } from './runedHelpers';
  import Component from './component.svelte';
  import { fade } from 'svelte/transition';
  import Forecast from '$lib/components/widgets/Weather/Forecast.svelte';

  const { data } = $props();
  let weather = $state(data.weather);
  let mounted = $state(false);

  onMount(() => {
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    mounted = true;
    // console.log('weather', weather.current);
  });

  $effect(() => {
    // console.log(weather);
  });
</script>

{#if mounted}
  <div class="runed" transition:fade>
    <h1>Hello.</h1>
    {#if weather.current}<h2>
        The current temperature is: {Math.round(
          Number(weather.current.apparent_temperature)
        )}
      </h2>{/if}
    <Component />
    {#if weather.daily && weather.current}
      <Forecast daily={weather.daily} isDay={weather.current.is_day} />
    {/if}
  </div>
{/if}

<style>
  .runed {
    color: var(--bgColor);
    filter: invert();
  }
</style>
