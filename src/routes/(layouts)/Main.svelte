<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import '$lib/app.pcss';
  import BackgroundFrame from '$lib/components/Board/BackgroundFrame.svelte';
  import ClearOrCloudy from '$lib/components/Board/Backgrounds/ClearOrCloudy.svelte';
  import Slider from '$lib/components/TimeMachine/Slider.svelte';
  import { Button, DarkMode } from 'flowbite-svelte';
  import { RefreshOutline } from 'flowbite-svelte-icons';
  import time from '$lib/stores/time';
  import { onDestroy } from 'svelte';

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesToday = hours * 60 + minutes;

  $time = minutesToday;
  let hh: string = '00';
  let mm: string = '00';

  let timeValue: number;
  const unsubscribe = time.subscribe((value) => {
    timeValue = value;
    hh = Math.trunc(timeValue / 60).toString();
    mm = (timeValue % 60).toString();
  });

  function refresh() {
    invalidateAll();
    localStorage.removeItem('color-theme');
  }
  onDestroy(unsubscribe);
</script>

<BackgroundFrame component={ClearOrCloudy} />
<main>
  <slot name="countdown-bar" />
  <header class="flex flex-row justify-between p-3 opacity-50">
    <slot name="additional-controls" />
    <DarkMode class="grow mix-blend-difference" />
    <p class="timemachine__time">
      {hh}:{mm}
    </p>
    <Button
      size="sm"
      color="light"
      on:click={() => refresh()}
      class="border-opacity-0 bg-opacity-25 mix-blend-difference"
      ><RefreshOutline /></Button
    >
  </header>
  <slot />
  <Slider />
</main>

<slot name="footer" />

<style>
  .timemachine__time {
    color: white;
    flex-shrink: 0;
    justify-content: end;
    align-items: center;
    display: flex;
    padding-right: 0.5rem;
  }
</style>
