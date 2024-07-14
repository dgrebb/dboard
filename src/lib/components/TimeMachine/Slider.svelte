<script lang="ts">
  import legTime from '$stores/legTime';
  import { Range } from 'flowbite-svelte';

  let minutesPerDay = 24 * 60;
  // let timeOfDay = 12 * 60;
</script>

<div class="time-machine">
  <Range min="0" max={minutesPerDay} size="md" bind:value={$legTime} />
</div>

<style>
  .time-machine {
    position: absolute;
    bottom: 3%;
    opacity: 0.1;
    z-index: 1;
    width: 100%;
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
