<script lang="ts">
  import '$lib/styles/app.pcss';
  import { LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import { onMount } from 'svelte';
  import { setTime } from './runedHelpers';
  import Component from './component.svelte';
  import { fade } from 'svelte/transition';
  import Forecast from '$lib/components/widgets/Weather/Forecast.svelte';
  import { counter } from './location.svelte';
  import { background, weather } from '$root/lib/stores';
  import { conduct } from './maestro.svelte';
  let mounted = false;

  onMount(async () => {
    await conduct(LATITUDE, LONGITUDE);
    mounted = true;
  });
</script>

{#if mounted}
  <div class="runed" transition:fade>
    <h1>Hello.</h1>
    <p>The API has been called {counter.count} times.</p>
    {#if weather.current}<h2>
        The current temperature is: {Math.round(
          Number(weather.current.apparent_temperature)
        )}
      </h2>{/if}
    <Component />
    {#if weather.daily && weather.current}
      <Forecast daily={weather.daily} />
    {/if}
  </div>
{/if}

<style>
  .runed {
    color: var(--bgColor);
    filter: invert();
  }
</style>
