<script lang="ts">
  import AudioWave from '$lib/components/Animations/AudioWave.svelte';
  import type { MusicData } from '$lib/types';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let file: string, title: string, album: string, artist: string;
  $: file = '/album_art.png';
  $: newFile = '';
  $: modal = false;
  $: title = '';
  $: album = '';
  $: artist = '';
  $: transitionImages = false;

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
          previousContent = currentContent; // Update the previous file content
          const music = await fetch('/api/music');
          ({ album, title, artist } = await music.json());
          transitionImages = true;

          const reset = function () {
            setTimeout(() => {
              file = newFile;
              newFile = '';
              transitionImages = false;
            }, 1000);
          };

          setTimeout(() => {
            reset();
            newFile = `/album_art.png?_=${timestamp}`;
          }, 1000);
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

{#if !modal}
  <div class="current-music" transition:fade>
    <div class="current-music__info flex flex-col">
      <h1>{title}</h1>
      <h2>{artist}</h2>
      <h3>{album}</h3>
    </div>
    {#key newFile}
      {#if newFile.length < 1}
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <img
          src={file}
          alt="hi"
          on:click={toggleModal}
          on:keydown={toggleModal}
          role="switch"
          tabindex="0"
          aria-checked="false"
          class="transition-opacity {transitionImages
            ? 'opacity-0'
            : 'opacity-100'}"
        />
      {/if}
      {#if newFile.length > 0}
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <img
          src={newFile}
          alt="hi"
          on:click={toggleModal}
          on:keydown={toggleModal}
          role="switch"
          tabindex="0"
          aria-checked="false"
          class="transition-opacity {transitionImages
            ? 'opacity-100'
            : 'opacity-0'}"
        />
      {/if}
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
    <img src={file} alt="" />
    <div class="current-music__modal__info flex flex-col">
      <h1>{title}</h1>
      <h2>{artist}</h2>
      <h3>{album}</h3>
    </div>
    <AudioWave />
  </div>
{/if}
