<script lang="ts">
  import { P } from 'flowbite-svelte';
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
    DayFog,
    Fog,
    NightFog,
  } from 'svelte-weather';
  import type { Fragment } from 'svelte/types/compiler/interfaces';

  export let weatherCode: number[] = [];
  export let isDay: boolean = true;
  export let color: string;
  $: iconType = weatherCode[0];
  let icon: ComponentType | string;

  interface IconMap {
    [index: number]: ComponentType;
  }

  const dayIconMap: IconMap = {
    0: DaySunny,
    1: DaySunnyOvercast,
    2: DayCloudy,
    3: Cloudy,
    45: DayFog,
    48: Fog,
  };

  const nightIconMap: IconMap = {
    0: NightClear,
    1: NightPartlyCloudy,
    2: NightCloudy,
    3: NightCloudyHigh,
    45: NightFog,
    48: Fog,
  };

  onMount(() => {
    icon = isDay ? dayIconMap[iconType] : nightIconMap[iconType];
  });
</script>

<div class="big-icon-wow">
  {#if icon !== undefined}
    <svelte:component this={icon} size="80" {color} />
  {:else}
    <p>{iconType}</p>
  {/if}
</div>

<style>
  .big-icon-wow {
    position: absolute;
    right: 1.25rem;
    top: 1.25rem;
    svg {
      height: 100%;
      width: 100%;
    }
  }
</style>
