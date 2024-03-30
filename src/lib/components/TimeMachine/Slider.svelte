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
    position: absolute;
    bottom: 3%;
    width: 100%;
    opacity: 0.1;
    &:hover {
      opacity: 0.5;
    }
    &:focus,
    &:active,
    &:focus-visible {
      opacity: 0.77;
    }
  }
</style>
