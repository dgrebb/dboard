<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Card } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import BloodGlucoseGraph from './BloodGlucoseGraph.svelte';
  import type { ChartSeriesGlucose } from '$lib/types';

  export let label: string | boolean = false;
  export let mainDisplayValue: number | string | boolean = false;
  export let data: ChartSeriesGlucose[] = [];
</script>

<div transition:fade class="card-container relative">
  {#key data}
    <Card size="xl" class="dboard__card relative">
      <h2>{label}</h2>

      <BloodGlucoseGraph {data} />
      <h1
        class="z-10 mt-auto justify-end text-9xl text-red-700 mix-blend-plus-lighter"
      >
        {mainDisplayValue}
      </h1>
    </Card>
  {/key}
</div>
