<script lang="ts">
  import './controls.css';
  import { Button } from 'flowbite-svelte';
  import { clickOutside } from '$lib/actions/clickOutside';

  import { createEventDispatcher } from 'svelte';
  import { homeState } from '$root/lib/stores';
  import Icon from '@iconify/svelte';

  // Define the component props
  type Props = {
    webSocketEstablished?: boolean;
  };

  // Define the state variables
  let open = $state(false);
  let toggleable = $state(false);
  let showVersions = $state(false);
  let showStateDebug = $state(false);

  let iconSize = 27;

  let {
    status,
    artist,
    album,
    art,
    gradient,
    loved,
    relativeTimePosition,
    title,
    totalTime,
  } = $state(homeState.nowPlaying());

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

  const toggleShowStateDebug = (): void => {
    showStateDebug = !showStateDebug;
  };

  $effect(() => {
    ({
      status,
      artist,
      album,
      art,
      gradient,
      loved,
      relativeTimePosition,
      title,
      totalTime,
    } = homeState.nowPlaying());
  });
</script>

<!-- Component Template -->
<div
  use:clickOutside={(e: Event) => hideControls(e)}
  class="controls-container flex h-1/3 w-full"
>
  <Button
    size="sm"
    color="light"
    class={`absolute right-3 top-3 self-end border-opacity-0 bg-opacity-25 opacity-0 bg-blend-overlay mix-blend-difference transition-opacity ${
      open ? 'opacity-100' : 'opacity-0'
    } controls-toggle`}
    on:click={toggleControls}
    on:hover={enableToggle}
    on:blur={disableToggle}
  >
    <Icon
      icon="solar:settings-outline"
      height={iconSize}
      width={iconSize}
      class="mr-3"
    />
    {open ? 'Hide' : 'Show'} Controls
  </Button>

  {#if open}
    <div class="controls absolute left-3 top-3 z-10 w-4/5">
      <!-- <Button
        size="sm"
        disabled={!webSocketEstablished}
        color="dark"
        class="control border-opacity-0 bg-opacity-25 text-green-500 bg-blend-overlay mix-blend-difference"
        on:click={closeSocket}
      >
        <Icon
          icon="solar:plug-circle-outline"
          height={iconSize}
          width={iconSize}
        />
      </Button>

      <Button
        size="sm"
        disabled={webSocketEstablished}
        color="dark"
        class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
        on:click={establishWebSocket}
      >
        <Icon
          icon="solar:plug-circle-outline"
          height={iconSize}
          width={iconSize}
        />
      </Button> -->

      <Button
        size="sm"
        color="dark"
        class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
        on:click={refreshDboard}
      >
        <Icon icon="solar:refresh-outline" height={iconSize} width={iconSize} />
      </Button>

      <div class="version-selector relative">
        <!-- <Button
          size="sm"
          color="dark"
          class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
          on:click={toggleVersions}
        >
          <Icon
            icon="solar:branching-paths-down-outline"
            height={iconSize}
            width={iconSize}
            class="mr-3"
          />
          Version
        </Button> -->
        <Button
          size="sm"
          color="dark"
          class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
          on:click={toggleShowStateDebug}
        >
          <Icon
            icon="solar:bug-outline"
            height={iconSize}
            width={iconSize}
            class="mr-3"
          />
          Debug
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

{#if showStateDebug}
  <dl class="state-list absolute left-9 top-20 block bg-blend-difference">
    <dt>status:</dt>
    <dd>{status}</dd>
    <dt>artist:</dt>
    <dd>{artist}</dd>
    <dt>album:</dt>
    <dd>{album}</dd>
    <dt>art:</dt>
    <dd>{art}</dd>
    <dt>gradient:</dt>
    <dd>{gradient}</dd>
    <dt>loved:</dt>
    <dd>{loved}</dd>
    <dt>relativeTimePosition:</dt>
    <dd>{relativeTimePosition}</dd>
    <dt>title:</dt>
    <dd>{title}</dd>
    <dt>totalTime:</dt>
    <dd>{totalTime}</dd>
  </dl>
{/if}

<style lang="postcss">
  .state-list {
    display: inline-block;
    text-color: white;
    mix-blend-mode: difference;

    &::before {
      content: ' ';
      display: table;
    }

    &::after {
      clear: both;
    }

    dt {
      margin-right: 5px;
      display: inline-block;
      float: left;
      clear: left;
    }

    dd {
      display: inline-block;
      float: left;
      padding-left: 0;
      margin-left: 0;
    }
    dt {
      font-weight: bold;
    }
  }
</style>
