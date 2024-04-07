<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let file: string;
  $: file = '';
  $: modal = false;

  const refreshInterval = 5000; // Interval in milliseconds to check for updates
  let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
  let previousContent: string | null = null; // Previous file content
  let timestamp = 0; // Initial timestamp value

  onMount(() => {
    pollFile(); // Start polling for changes when the component mounts
  });

  function toggleModal() {
    modal = !modal;
  }

  async function pollFile() {
    try {
      timestamp = Date.now(); // Update the timestamp for each poll
      const response = await fetch(`/album_art.png?_=${timestamp}`);
      if (response.ok) {
        const currentContent = await response.text();
        if (currentContent !== previousContent) {
          file = `/album_art.png?_=${timestamp}`; // Update the file path if the file content has changed
          previousContent = currentContent; // Update the previous file content
        }
      } else {
        file = ''; // Clear the file path if the file does not exist
        previousContent = null; // Reset previous file content
      }
    } catch (error) {
      console.error('Error polling file:', error);
    } finally {
      refreshTimer = setTimeout(pollFile, refreshInterval); // Schedule the next poll
    }
  }

  onDestroy(() => {
    clearInterval(refreshTimer); // Clear the timer when the component is destroyed
  });
</script>

<div class="current-music" transition:fade>
  {#key file}
    <img src={file} alt="" on:click={toggleModal} />
  {/key}
</div>

{#if modal}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="music-modal"
    transition:fade
    on:click={toggleModal}
    on:keydown={toggleModal}
  >
    <img src={file} alt="" />
  </div>
{/if}

<style>
  .music-modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
</style>
