<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let file: string;
  let PUBLIC_MUSIC_TITLE: string,
    PUBLIC_MUSIC_ARTIST: string,
    PUBLIC_MUSIC_ALBUM: string;
  $: file = '';
  $: modal = false;

  const refreshInterval = 5000; // Interval in milliseconds to check for updates
  let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
  let previousContent: string | null = null; // Previous file content
  let timestamp = 0; // Initial timestamp value

  onMount(() => {
    pollFile(); // Start polling for changes when the component mounts
  });

  let MUSIC_TITLE, MUSIC_ARTIST, MUSIC_ALBUM;

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
      ({ PUBLIC_MUSIC_TITLE, PUBLIC_MUSIC_ARTIST, PUBLIC_MUSIC_ALBUM } =
        await import('$env/static/public'));
      refreshTimer = setTimeout(pollFile, refreshInterval); // Schedule the next poll
    }
  }

  onDestroy(() => {
    clearInterval(refreshTimer); // Clear the timer when the component is destroyed
  });
</script>

{#if !modal}
  <div
    class="current-music"
    transition:fade
    on:click={toggleModal}
    on:keydown={toggleModal}
    role="switch"
    tabindex="0"
    aria-checked="false"
  >
    <div class="current-music__info flex flex-col">
      <h1>{PUBLIC_MUSIC_TITLE}</h1>
      <h2>{PUBLIC_MUSIC_ARTIST}</h2>
      <h3>{PUBLIC_MUSIC_ALBUM}</h3>
    </div>
    {#key file}
      <img src={file} alt="{PUBLIC_MUSIC_ALBUM} Artwork" />
    {/key}
  </div>
{/if}

{#if modal}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="current-music__modal"
    transition:fade
    on:click={toggleModal}
    on:keydown={toggleModal}
  >
    <div class="current-music__modal__info flex flex-col">
      <h2>{PUBLIC_MUSIC_ARTIST}</h2>
      <h1>{PUBLIC_MUSIC_TITLE}</h1>
      <h3>{PUBLIC_MUSIC_ALBUM}</h3>
    </div>
    <img src={file} alt="" />
  </div>
{/if}
