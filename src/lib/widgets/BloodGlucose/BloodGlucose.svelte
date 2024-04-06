<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import BloodGlucoseGraph from './BloodGlucoseGraph.svelte';
  import type { ChartSeriesGlucose } from '$lib/types';

  export let label: string | boolean = false;
  export let mainDisplayValue: number | string | boolean = false;
  export let data: ChartSeriesGlucose[] = [];

  let loaded = false;
  let mainColor: string = 'green';
  var maxMeasurable = 400;
  var BGSeries: number[] = extractBGValues(data).reverse();
  var max: number = Math.max(...BGSeries);
  let currentBG: number = Number(mainDisplayValue);

  function extractBGValues(data: ChartSeriesGlucose[]) {
    return data.map((item) => item.sgv);
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

  onMount(() => {
    loaded = true;
  });
</script>

<div
  transition:fade
  class="dboard__grid__item relative"
  style={`--mainColor: ${mainColor}`}
>
  {#key loaded}
    <div class="dboard__card glu relative border-none bg-transparent">
      <h2 class="text-[var(--mainColor)] brightness-50 dark:brightness-150">
        {label}
      </h2>

      <BloodGlucoseGraph data={BGSeries} {mainColor} areaColor={mainColor} />
      <h1
        class="dboard__card--value-lg bg-value z-10 mt-auto justify-end text-9xl brightness-50 dark:brightness-150"
      >
        {mainDisplayValue}
      </h1>
    </div>
  {/key}
</div>

<style lang="postcss">
  .bg-value {
    color: var(--mainColor);
  }
</style>
