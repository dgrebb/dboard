<script lang="ts">
  // import { invalidateAll } from '$app/navigation';
  import BackgroundFrame from '@components/Board/BackgroundFrame.svelte';
  import ForegroundFrame from '@components/Board/ForegroundFrame.svelte';
  import { pullToRefresh } from '@actions/pullToRefresh';
  import ClearOrCloudy from '@components/Board/Backgrounds/ClearOrCloudy.svelte';
  import Controls from '@components/Controls/Controls.svelte';
  import type { QuarterHours } from '@types';
  import { uiState } from '@stores';
  import { timeState } from '@stores';
  import type { Snippet } from 'svelte';
  import { onDestroy, onMount } from 'svelte';
  import { isTouchDevice } from '@utils';
  import HomeControlPanel from '$lib/components/HomeControl/HomeControlPanel.svelte';

  // TODO: Kiosk Prop Implementation
  // import { browser } from '$app/environment';

  // TODO: Integrations for Kiosk Pro
  // let idleTimer = $state(true);

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

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  let clock = $state(timeState.hoursMinutesString());
  let modalActive = $state(uiState.modalActive());
  let quarterHours: QuarterHours = $state(1);
  let counter = 1;

  const appTime = setInterval(() => {
    const now = new Date(Date.now());
    counter++;
    timeState.setTime(now);
    // if the 15s interval has run 60 times (15 min)
    if (counter === 60) {
      quarterHours++;
      timeState.setQuarter(quarterHours);
      counter = 1;
    }
    if (quarterHours === 4) quarterHours = 1;
  }, 15000);

  // function refresh() {
  //   invalidateAll();
  //   localStorage.removeItem('color-theme');
  // }

  $effect(() => {
    clock = timeState.hoursMinutesString();
  });

  $effect(() => {
    modalActive = uiState.modalActive();
  });

  onMount(() => {
    // NOTE: Disable Right Click. user-select, oncontextmenu, pointer-event
    if (isTouchDevice()) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  });

  onDestroy(() => {
    clearInterval(appTime);
  });
</script>

<header class="header">
  <p class="app-time">
    {#key clock}{clock}{/key}
  </p>
  <HomeControlPanel />
  <Controls />
</header>

<ForegroundFrame />
<BackgroundFrame BackgroundComponent={ClearOrCloudy} />

<main use:pullToRefresh class="dboard" class:modalActive>
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
