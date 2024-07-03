<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import BackgroundFrame from '$components/Board/BackgroundFrame.svelte';
  import ForegroundFrame from '$components/Board/ForegroundFrame.svelte';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';
  import ClearOrCloudy from '$lib/components/Board/Backgrounds/ClearOrCloudy.svelte';
  import Controls from '$lib/components/Controls/Controls.svelte';
  import { timeState } from '$lib/stores';
  import type { Snippet } from 'svelte';
  import { onDestroy } from 'svelte';

  // TODO: Kiosk Prop Implementation
  // import { browser } from '$app/environment';
  // import type { CheckboxEvents } from 'flowbite-svelte/Checkbox.svelte';

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

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  let clock = $state(timeState.hoursMinutesString());

  const appTime = setInterval(() => {
    const now = new Date(Date.now());
    timeState.set(now);
  }, 15000);

  function refresh() {
    invalidateAll();
    localStorage.removeItem('color-theme');
  }

  $effect(() => {
    clock = timeState.hoursMinutesString();
  });

  onDestroy(() => {
    clearInterval(appTime);
  });
</script>

<header class="header">
  <p class="app-time">
    {#key clock}{clock}{/key}
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
