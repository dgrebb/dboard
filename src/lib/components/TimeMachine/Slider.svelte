<script lang="ts">
  import { Range } from 'flowbite-svelte';
  import { time } from '$lib/store';
  import { onDestroy } from 'svelte';

  let minutesPerDay = 24 * 60;
  let timeOfDay = 12 * 60;
</script>

<div class="time-machine">
  <Range min="0" max={minutesPerDay} size="md" bind:value={$time} />
</div>

<style>
  .time-machine {
    z-index: 1;
    position: relative;
  }
</style>
