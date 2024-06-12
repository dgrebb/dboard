<script lang="ts">
  import ClearOrCloudy from '$lib/components/Board/Backgrounds/ClearOrCloudy.svelte';
  import BackgroundFrame from '$components/Board/BackgroundFrame.svelte';
  import ForegroundFrame from '$components/Board/ForegroundFrame.svelte';
  import Controls from '$root/lib/components/Controls/Controls.svelte';
  import { invalidateAll } from '$app/navigation';
  import time from '$lib/stores/time';
  import { onDestroy } from 'svelte';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';

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
    hh = Math.trunc(timeValue / 60)
      .toString()
      .padStart(2, '0');
    mm = (timeValue % 60).toString().padStart(2, '0');
  });

  function refresh() {
    invalidateAll();
    localStorage.removeItem('color-theme');
  }

  onDestroy(unsubscribe);
</script>

<header class="header">
  <!-- <Controls
    {webSocketEstablished}
    on:closeSocket={closeSocket}
    on:establishWebSocket={establishWebSocket}
  /> -->
  <p class="time">
    {hh}:{mm}
  </p>
  <Controls />
</header>

<ForegroundFrame />
<BackgroundFrame component={ClearOrCloudy} />

<main use:pullToRefresh class="dboard">
  <slot><h1>There is no page here.</h1></slot>
</main>
