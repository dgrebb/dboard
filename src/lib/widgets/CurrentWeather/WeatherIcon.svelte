<script lang="ts">
  import { SvelteComponent, onMount, type ComponentType } from 'svelte';
  import {
    Cloudy,
    DayCloudy,
    DaySunny,
    DaySunnyOvercast,
    NightClear,
    NightPartlyCloudy,
    NightCloudy,
    NightCloudyHigh,
  } from 'svelte-weather';

  export let weatherCode: number = 2;
  export let isDay: boolean = true;
  let icon: ComponentType;

  interface IconMap {
    [index: number]: ComponentType;
  }

  const dayIconMap: IconMap = {
    0: DaySunny,
    1: DaySunnyOvercast,
    2: DayCloudy,
    3: Cloudy,
  };

  const nightIconMap: IconMap = {
    0: NightClear,
    1: NightPartlyCloudy,
    2: NightCloudy,
    3: NightCloudyHigh,
  };

  onMount(() => {
    icon = isDay ? dayIconMap[weatherCode] : nightIconMap[weatherCode];
  });
</script>

<div>
  <svelte:component this={icon} />
</div>

<style>
  /* your styles go here */
</style>
