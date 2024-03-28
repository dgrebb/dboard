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
    NightSprinkle,
    NightRainMix,
  } from 'svelte-weather';
  import type { Fragment } from 'svelte/types/compiler/interfaces';

  interface IconMap {
    [index: number]: Icon;
  }

  type Icon = {
    component: ComponentType;
    color: string;
  };

  export let weatherCode: number = 0;
  export let isDay: boolean = true;

  $: iconType = weatherCode;
  let icon: Icon;

  const lightYellowGray = '#fbf1de';
  const brightGreen = '#37cc37';
  const brightYellow = '#ccc737';
  const paleGreen = '#37cc7f';
  const paleYellow = '#e5e5e5';
  const lightBlue = '#8882cf';
  const darkBlue = '#55508f';
  const darkBlueGray = '#7347a8';
  const paleBlueGreenGray = '#85aba0';
  const moonSprinkle = 'rgb(162, 207, 234)';

  const dayIconMap: IconMap = {
    0: {
      component: DaySunny,
      color: brightYellow,
    },
    1: {
      component: DaySunnyOvercast,
      color: paleGreen,
    },
    2: {
      component: DayCloudy,
      color: paleBlueGreenGray,
    },
    3: {
      component: Cloudy,
      color: '#62788d',
    },
    45: {
      component: DayFog,
      color: paleBlueGreenGray,
    },
    48: {
      component: Fog,
      color: paleBlueGreenGray,
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
      color: paleYellow,
    },
    1: {
      component: NightPartlyCloudy,
      color: lightYellowGray,
    },
    2: {
      component: NightCloudy,
      color: paleBlueGreenGray,
    },
    3: {
      component: NightCloudyHigh,
      color: darkBlueGray,
    },
    45: {
      component: NightFog,
      color: darkBlueGray,
    },
    48: {
      component: Fog,
      color: darkBlueGray,
    },
    51: {
      component: NightSprinkle,
      color: moonSprinkle,
    },
    52: {
      component: NightRainMix,
      color: moonSprinkle,
    },
    53: {
      component: NightRainMix,
      color: moonSprinkle,
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
    <svelte:component this={icon.component} size="300" color={icon.color} />
  {:else}
    <p>{iconType}</p>
  {/if}
</div>
