<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let file: string;
  $: file = ''; // Reactive statement to recompute file when it changes

  const refreshInterval = 5000; // Interval in milliseconds to check for updates
  let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
  let previousContent: string | null = null; // Previous file content
  let timestamp = 0; // Initial timestamp value

  onMount(() => {
    pollFile(); // Start polling for changes when the component mounts
  });

  onDestroy(() => {
    clearInterval(refreshTimer); // Clear the timer when the component is destroyed
  });

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
</script>

<div class="current-music" transition:fade>
  {#key file}
    <img src={file} alt="" />
  {/key}
</div>
