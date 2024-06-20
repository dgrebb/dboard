<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import {
    AdjustmentsHorizontalSolid,
    ArrowUpDownOutline,
    CloseCircleOutline,
    RefreshOutline,
  } from 'flowbite-svelte-icons';
  import { clickOutside } from '$lib/actions/clickOutside';
  import './controls.css';

  import { createEventDispatcher } from 'svelte';

  // Define the component props
  type Props = {
    webSocketEstablished?: boolean;
  };

  // Define the state variables
  let open = $state(false);
  let toggleable = $state(false);
  let showVersions = $state(false);

  // Destructure props with default values
  let { webSocketEstablished = false }: Props = $props();

  // Create an event dispatcher
  const dispatch = createEventDispatcher();

  // Function to close WebSocket connection
  const closeSocket = (): void => {
    dispatch('closeSocket');
  };

  // Function to establish WebSocket connection
  const establishWebSocket = (): void => {
    dispatch('establishWebSocket');
  };

  // Function to enable toggle
  const enableToggle = (): void => {
    toggleable = true;
  };

  // Function to disable toggle
  const disableToggle = (): void => {
    toggleable = false;
  };

  // Function to toggle controls visibility
  const toggleControls = (): void => {
    open = !open;
    if (!open) {
      showVersions = false;
    }
  };

  // Function to hide controls
  const hideControls = (e: Event): void => {
    e.preventDefault();
    open = false;
    toggleable = false;
    showVersions = false;
  };

  // Function to refresh the dashboard
  const refreshDboard = (): void => {
    location.reload();
  };

  // Function to toggle version display
  const toggleVersions = (): void => {
    if (open) {
      showVersions = !showVersions;
    } else {
      showVersions = false;
    }
  };
</script>

<!-- Component Template -->
<div
  use:clickOutside={(e: Event) => hideControls(e)}
  class="controls-container flex h-1/3 w-full"
>
  <Button
    size="sm"
    color="light"
    class={`controls-toggle w-full self-end border-opacity-0 bg-opacity-25 opacity-0 bg-blend-overlay mix-blend-difference transition-opacity hover:opacity-100 active:opacity-100 ${
      open ? 'w-auto opacity-100' : 'w-full opacity-0'
    }`}
    on:click={toggleControls}
    on:hover={enableToggle}
    on:blur={disableToggle}
  >
    {open ? 'Hide' : 'Show'} Controls
  </Button>

  {#if open}
    <div class="controls absolute left-3 top-3 z-10 w-4/5">
      <Button
        size="sm"
        disabled={!webSocketEstablished}
        color="dark"
        class="control border-opacity-0 bg-opacity-25 text-green-500 bg-blend-overlay mix-blend-difference"
        on:click={closeSocket}
      >
        <CloseCircleOutline />
      </Button>

      <Button
        size="sm"
        disabled={webSocketEstablished}
        color="dark"
        class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
        on:click={establishWebSocket}
      >
        <ArrowUpDownOutline />
      </Button>

      <Button
        size="sm"
        color="dark"
        class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
        on:click={refreshDboard}
      >
        <RefreshOutline />
      </Button>

      <div class="version-selector relative">
        <Button
          size="sm"
          color="dark"
          class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
          on:click={toggleVersions}
        >
          <AdjustmentsHorizontalSolid />Version
        </Button>

        {#if showVersions}
          <div class="version-select absolute bg-slate-400 text-purple-900">
            <h1>Versions</h1>
            <a href="/">v2</a>
            <a href="/v1">v1</a>
            <a href="/b">b</a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
