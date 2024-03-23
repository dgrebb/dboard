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
    DayShowers,
    DayRain,
    Rain,
    NightShowers,
    NightRain,
  } from 'svelte-weather';
  import type { Fragment } from 'svelte/types/compiler/interfaces';

  interface IconMap {
    [index: number]: Icon;
  }

  type Icon = {
    component: ComponentType;
    color: string;
  };

  export let weatherCode: number[] = [];
  export let isDay: boolean = true;
  export let color: string;

  $: iconType = weatherCode[0];
  let icon: Icon;

  const lightBlue = '#8882cf';
  const darkBlue = '#55508f';

  const dayIconMap: IconMap = {
    0: {
      component: DaySunny,
      color: '#fefefe',
    },
    1: {
      component: DaySunnyOvercast,
      color: '#fefefe',
    },
    2: {
      component: DayCloudy,
      color: '#fefefe',
    },
    3: {
      component: Cloudy,
      color: '#fefefe',
    },
    45: {
      component: DayFog,
      color: '#fefefe',
    },
    48: {
      component: Fog,
      color: '#fefefe',
    },
    61: {
      component: DayShowers,
      color: lightBlue,
    },
    63: {
      component: DayRain,
      color: lightBlue,
    },
    65: {
      component: Rain,
      color: lightBlue,
    },
  };

  const nightIconMap: IconMap = {
    0: {
      component: NightClear,
      color: '#fe8763',
    },
    1: {
      component: NightPartlyCloudy,
      color: '#fe8763',
    },
    2: {
      component: NightCloudy,
      color: '#fe8763',
    },
    3: {
      component: NightCloudyHigh,
      color: '#fe8763',
    },
    45: {
      component: NightFog,
      color: '#fe8763',
    },
    48: {
      component: Fog,
      color: '#fe8763',
    },
    61: {
      component: NightShowers,
      color: darkBlue,
    },
    63: {
      component: NightRain,
      color: darkBlue,
    },
    65: {
      component: Rain,
      color: darkBlue,
    },
  };

  onMount(() => {
    icon = isDay ? dayIconMap[iconType] : nightIconMap[iconType];
  });
</script>

<div class="big-icon-wow">
  {#if icon !== undefined}
    <svelte:component this={icon.component} size="177" color={icon.color} />
  {:else}
    <p>{iconType}</p>
  {/if}
</div>

<style>
  .big-icon-wow {
    position: absolute;
    right: -3.25rem;
    top: -4rem;
    svg {
      height: 100%;
      width: 100%;
    }
  }
</style>
