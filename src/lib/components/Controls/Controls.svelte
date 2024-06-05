<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import {
    ArrowUpDownOutline,
    CloseCircleOutline,
    RefreshOutline,
  } from 'flowbite-svelte-icons';
  export let webSocketEstablished: boolean;
  import { createEventDispatcher } from 'svelte';

  $: open = false;

  const dispatch = createEventDispatcher();

  const closeSocket = () => {
    dispatch('closeSocket');
  };

  const establishWebSocket = () => {
    dispatch('establishWebSocket');
  };

  const toggleControls = function toggleControls() {
    open = !open;
  };

  const refreshDboard = function refreshDboard() {
    location.reload();
  };
</script>

<Button
  size="sm"
  color="light"
  class="absolute right-0 top-0 border-opacity-0 bg-opacity-25 opacity-0 bg-blend-overlay mix-blend-difference transition-opacity hover:opacity-100 active:opacity-100"
  onclick={toggleControls}>{open ? 'Hide' : 'Show'} Controls</Button
>
<div class="absolute left-0 top-0 {open ? `visible` : `hidden`}">
  <Button
    size="sm"
    disabled={!webSocketEstablished}
    color="dark"
    class="border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
    on:click={closeSocket}><CloseCircleOutline /></Button
  >

  <Button
    size="sm"
    disabled={webSocketEstablished}
    color="dark"
    class="border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
    on:click={establishWebSocket}><ArrowUpDownOutline /></Button
  >

  <Button
    size="sm"
    color="dark"
    class="border-opacity-0 bg-opacity-25 bg-blend-overlay mix-blend-difference"
    on:click={refreshDboard}><RefreshOutline /></Button
  >
</div>
