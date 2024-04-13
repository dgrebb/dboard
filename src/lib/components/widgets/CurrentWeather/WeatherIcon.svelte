<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

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
    DaySprinkle,
    DayRainMix,
  } from 'svelte-weather';
  import type { Fragment } from 'svelte/types/compiler/interfaces';

  interface IconMap {
    [index: number]: IconProps;
  }

  type IconProps = {
    icon: string;
    color: string;
  };

  export let weatherCode: number = 0;
  console.log('🚀 ~ weatherCode:', weatherCode);
  export let isDay: number = 1;

  $: iconType = weatherCode;
  let icon: IconProps;

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
  const daySprinkle = 'rgb(104, 70, 240)';

  const dayIconMap: IconMap = {
    0: {
      icon: 'clear-day-fill',
      color: brightYellow,
    },
    1: {
      icon: 'overcast-day-fill',
      color: paleGreen,
    },
    2: {
      icon: 'partly-cloudy-day-fill',
      color: paleBlueGreenGray,
    },
    3: {
      icon: 'overcast-fill',
      color: '#62788d',
    },
    45: {
      icon: 'fog-day-fill',
      color: paleBlueGreenGray,
    },
    48: {
      icon: 'fog-fill',
      color: paleBlueGreenGray,
    },
    51: {
      icon: 'overcast-day-drizzle-fill',
      color: daySprinkle,
    },
    53: {
      icon: 'extreme-day-drizzle-fill',
      color: daySprinkle,
    },
    55: {
      icon: 'extreme-day-rain-fill',
      color: daySprinkle,
    },
    61: {
      icon: 'extreme-day-rain-fill',
      color: lightBlue,
    },
    63: {
      icon: 'rain-fill',
      color: lightBlue,
    },
    65: {
      icon: 'extreme-rain-fill',
      color: lightBlue,
    },
  };

  const nightIconMap: IconMap = {
    0: {
      icon: 'clear-night-fill',
      color: paleYellow,
    },
    1: {
      icon: 'partly-cloudy-night-fill',
      color: lightYellowGray,
    },
    2: {
      icon: 'overcast-night-fill',
      color: paleBlueGreenGray,
    },
    3: {
      icon: 'overcast-night-fill',
      color: paleBlueGreenGray,
    },
    45: {
      icon: 'haze-night-fill',
      color: paleBlueGreenGray,
    },
    48: {
      icon: 'fog-night-fill',
      color: paleBlueGreenGray,
    },
    51: {
      icon: 'partly-cloudy-night-drizzle-fil',
      color: moonSprinkle,
    },
    53: {
      icon: 'overcast-night-rain-fill',
      color: moonSprinkle,
    },
    55: {
      icon: 'partly-cloudy-night-rain-fill',
      color: moonSprinkle,
    },
    61: {
      icon: 'extreme-night-rain-fill',
      color: darkBlue,
    },
    63: {
      icon: 'extreme-night-rain-fill',
      color: darkBlue,
    },
    65: {
      icon: 'extreme-night-rain-fill',
      color: darkBlue,
    },
  };

  onMount(() => {
    icon = isDay === 1 ? dayIconMap[iconType] : nightIconMap[iconType];
  });
</script>

<div class="big-icon-wow">
  {#if icon !== undefined}
    <Icon icon={`meteocons:` + icon.icon} color={icon.color} width={200} />
  {:else}
    <Icon icon="meteocons:not-available-fill" width={200} />
    <p>{iconType}</p>
  {/if}
</div>
