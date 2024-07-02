<script lang="ts">
  import ClearOrCloudy from '$lib/components/Board/Backgrounds/ClearOrCloudy.svelte';
  import BackgroundFrame from '$components/Board/BackgroundFrame.svelte';
  import ForegroundFrame from '$components/Board/ForegroundFrame.svelte';
  import Controls from '$root/lib/components/Controls/Controls.svelte';
  import { invalidateAll } from '$app/navigation';
  import legTime from '$lib/stores/legTime';
  import { onDestroy, onMount } from 'svelte';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';
  import type { Snippet } from 'svelte';
  // TODO: Kiosk Prop Implementation
  // import { browser } from '$app/environment';
  // import type { CheckboxEvents } from 'flowbite-svelte/Checkbox.svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesToday = hours * 60 + minutes;

  $legTime = minutesToday;
  let hh: string = $state('00');
  let mm: string = $state('00');
  let timeValue: number;
  // TODO: Integrations for Kiosk Pro
  // let idleTimer = $state(true);

  const unsubscribe = legTime.subscribe((value) => {
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

  // TODO: Kiosk Prop Implementation
  // const KioskShouldDisableIdleTimer = () => {
  //   var shouldSkipAction = 'YES';
  //   if (idleTimer) {
  //     shouldSkipAction = 'NO';
  //   }
  //   return shouldSkipAction;
  // };

  // TODO: Kiosk Prop Implementation
  // const toggleIdleTimer = (e: CheckboxEvents) => {
  //   iz dleTimer = !idleTimer;
  //   setTimeout(() => (e.target.checked = idleTimer), 0);
  //   KioskShouldDisableIdleTimer();
  // };

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
  {#if children}
    {@render children()}
  {:else}
    <h1>There is no page here.</h1>
  {/if}
</main>

<!-- // TODO: Kiosk Prop Implementation
 <footer class="absolute bottom-0 z-30 w-full text-center">
  <input
    name="idle-timer"
    id="idle-timer"
    type="checkbox"
    checked={idleTimer}
    onclick={(e) => toggleIdleTimer(e)}
    class="h-9 w-9 text-blue-700"
  />
  <label for="idle-timer"
    >Idle Timer: {#if idleTimer}on{:else}off{/if}.</label
  >
</footer>

{#if browser}
  <script src="/kiosk_functions.js"></script>
{/if} -->
