<script lang="ts">
  import createLocation from '$root/lib/stores/location.svelte';
  import { onMount } from 'svelte';
  import { setTime } from './runedHelpers';
  import Component from './component.svelte';
  import { fade } from 'svelte/transition';

  let mounted = false;

  let { weather, time } = createLocation({
    weather: { apparent_temperature: 44.4 },
    time: {
      seconds: 2354234,
      is_day: 0,
      sunrise: 23234234,
      sunset: 2342,
    },
  });

  const data = {
    apparent_temperature: 50.23,
  };

  function handleSetWeather() {
    weather = data;
  }

  onMount(() => {
    mounted = true;
    let delay = 1000;
    (async function clock() {
      let now = new Date();
      time = await setTime(now);
      setTimeout(clock, delay);
    })();
  });
</script>

{#if mounted}
  <div transition:fade>
    <button on:click={handleSetWeather}>Set Weather</button>
    <p>{weather.apparent_temperature}</p>
    <Component {weather} {time} />
  </div>
{/if}
