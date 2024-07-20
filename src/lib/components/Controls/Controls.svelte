<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import './controls.css';

  import Debugger from '$components/Debugger/Debugger.svelte';
  import { musicState, homeState } from '$stores';
  import Icon from '@iconify/svelte';

  // Define the state variables
  let open = $state(false);
  let showVersions = $state(false);
  let showStateDebug = $state(false);

  let iconSize = 27;

  let musicDebug = $state(musicState.nowPlaying());
  let homeDebug = $state(homeState.state());

  // Function to toggle controls visibility
  const toggleControls = (): void => {
    open = !open;
  };

  // Function to hide controls
  // const hideControls = (e: Event): void => {
  //   e.preventDefault();
  //   open = false;
  // };

  // Function to refresh the dashboard
  const refreshDboard = (): void => {
    location.reload();
  };

  const toggleShowStateDebug = (): void => {
    showStateDebug = !showStateDebug;
  };

  $effect(() => {
    musicDebug = musicState.nowPlaying();
    homeDebug = homeState.state();
  });
</script>

<!-- Component Template -->
<div class="controls-container flex h-1/3 w-full">
  <Button
    size="sm"
    color="light"
    class={`absolute right-3 top-3 self-end border-opacity-0 bg-opacity-25 opacity-0 bg-blend-overlay mix-blend-difference transition-opacity ${
      open ? 'opacity-100' : 'opacity-0'
    } controls-toggle`}
    on:click={toggleControls}
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
      <Button
        size="sm"
        color="dark"
        class="control border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
        on:click={refreshDboard}
      >
        <Icon icon="solar:refresh-outline" height={iconSize} width={iconSize} />
      </Button>

      <div class="version-selector relative">
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
  <div class="debug-data">
    <Debugger debugData={musicDebug} title="Music" />
    <Debugger debugData={homeDebug} title="Home" />
  </div>
{/if}
