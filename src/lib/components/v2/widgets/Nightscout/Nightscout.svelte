<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import type { ChartSeriesGlucose } from '$lib/types';
  import NightScoutLineGraph from '$widgets/NightScout/NightScoutLineGraph.svelte';
  import { extractBGValues } from '$utils/nightscout';

  export let label: string | boolean = false;
  export let mainDisplayValue: number | string | boolean = false;
  export let direction: string = '';
  export let data: ChartSeriesGlucose[] = [];

  let loaded = false;
  let mainColor: string = 'green';
  var maxMeasurable = 400;
  var BGSeries: number[] = extractBGValues(data).reverse();
  var max: number = Math.max(...BGSeries);
  let currentBG: number = Number(mainDisplayValue);
  $: directionIcon = 'iconamoon:cloud-download-light';
  $: direction = direction;

  onMount(() => {
    loaded = true;

    if (direction) {
      switch (direction) {
        case 'Up':
          // console.log('up');
          directionIcon = 'ph:trend-up-light';
          break;

        case 'FortyFiveUp':
          // console.log('up');
          directionIcon = 'ph:arrow-bend-right-up-light';
          break;

        case 'Flat':
          // console.log('flat');
          directionIcon = 'material-symbols-light:trending-flat';
          break;

        case 'Down':
          // console.log('down');
          directionIcon = 'ph:trend-down-light';
          break;

        case 'FortyFiveDown':
          // console.log('up');
          directionIcon = 'ph:arrow-bend-right-down-light';
          break;

        default:
          // console.log('error');
          // console.log('🩸 ~ GLU ~ direction not covered:', direction);
          directionIcon = 'iconamoon:cloud-error-light';
          break;
      }
    }

    switch (true) {
      case currentBG < 70:
        mainColor = 'rgba(255, 0, 0, 0.5)';
        max = 100;
        break;
      case currentBG < 100:
        max = 100;
        mainColor = '#2a5c2c';
        break;
      case currentBG < 160:
        mainColor = '#2a5c2c';
        max = 200;
        break;
      case currentBG < 190:
        mainColor = '#8cbf2e';
        max = 200;
        break;
      case currentBG < 300:
        mainColor = '#fff700';
        max = 300;
        break;

      default:
        max = maxMeasurable;
        mainColor = '#ff00f7';
        break;
    }
  });
</script>

<div
  transition:fade
  class="dboard__grid__item relative transition-colors"
  style={`--mainColor: ${mainColor}`}
>
  {#key directionIcon}
    <div class="dboard__card glu relative border-none bg-transparent">
      <h2
        class="flex items-center text-[var(--mainColor)] brightness-50 dark:brightness-150"
      >
        {label}
        <Icon
          icon={directionIcon}
          height="32px"
          color={mainColor}
          class="ml-2 inline-flex align-middle brightness-50 dark:brightness-150"
        />
      </h2>

      <NightScoutLineGraph
        series={BGSeries}
        {mainColor}
        backgroundColor={mainColor}
        {maxMeasurable}
      />
      <h1
        class="dboard__card--value-lg bg-value z-10 mt-auto justify-end text-9xl tracking-tight brightness-50 dark:brightness-200"
      >
        {mainDisplayValue}
      </h1>
    </div>
  {/key}
</div>

<style lang="postcss">
  .bg-value {
    color: var(--mainColor);
    transition: color 30s ease-in;
  }
</style>
