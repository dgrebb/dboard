<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import AudioWave from '$lib/components/Animations/AudioWave.svelte';
  import type { DBoardItem } from '$lib/types';
  import { homeState } from '$root/lib/stores';
  import { uuidv4 } from '$utils/uuidv4';
  import { onDestroy, onMount } from 'svelte';
  import { cubicInOut } from 'svelte/easing';
  import { blur, fade } from 'svelte/transition';
  type Props = {
    items: DBoardItem[];
  };

  const { setNowPlaying, currentWeather } = homeState;
  const weather = $state(currentWeather());

  let { items }: Props = $props();
  let headlineValue1 = $state(items[0].content.large.value);
  let trend = $state(items[0].content.trend.direction);
  let difference = $state(items[0].series[0].sgv - items[0].series[1].sgv);
  let art = $state('/album_art.png');
  let newArt = $state('/album_art.png');
  let modal = $state(false);
  let title = $state('');
  let album = $state('');
  let artist = $state('');
  let loved: boolean = $state(false);
  let transitionImages = $state(false);
  let mounted = $state(false);
  let ws: WebSocket | null = null;
  const clientId = uuidv4();
  const refreshInterval = 5000; // Interval in milliseconds to check for updates
  let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
  let previousContent: string | null = null; // Previous file content
  let timestamp = 0; // Initial timestamp value
  let webSocketEstablished = $state(false);

  const establishWebSocket = () => {
    console.log('connecting', webSocketEstablished);
    if (webSocketEstablished) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(
      `${protocol}//${window.location.host}/websocket?id=${clientId}`
    );
    ws.addEventListener('open', (event) => {
      webSocketEstablished = true;
      console.log('[websocket] connection open', event);
    });
    ws.addEventListener('close', (event) => {
      webSocketEstablished = false;
      console.log('[websocket] connection closed', event);
    });
    ws.addEventListener('message', (event) => {
      console.log('[websocket] message received', event);
      ({ album, title, artist, loved } = JSON.parse(event.data));
    });
  };

  function toggleModal() {
    modal = !modal;
    localStorage.setItem('musicModal', modal.toString());
  }

  async function pollFile() {
    try {
      timestamp = Date.now(); // Update the timestamp for each poll
      const response = await fetch(`/album_art.png?_=${timestamp}`);
      if (response.ok) {
        const currentContent = await response.text();
        if (currentContent !== previousContent) {
          previousContent = currentContent; // Update the previous file content
          art = `/album_art.png?_=${timestamp}`;
        }
        const music = await fetch('/api/v1/music');
        ({ album, title, artist, loved } = await music.json());
        // loved = loved === 'true';
        // setNowPlaying({ artist, title, art, album, loved });
      } else {
        art = ''; // Clear the file path if the file does not exist
        previousContent = null; // Reset previous file content
      }
    } catch (error) {
      console.error('Error polling file:', error);
    } finally {
      refreshTimer = setTimeout(pollFile, refreshInterval); // Schedule the next poll
    }
  }

  onMount(async () => {
    pollFile(); // Start polling for changes when the component mounts
    let modalPreferences =
      localStorage.getItem('musicModal') === 'true' || false;
    modal = modalPreferences;
    // if (!mounted) {
    //   const music = await fetch('/api/v1/music');
    //   ({ album, title, artist } = await music.json());
    //   mounted = true;
    // }
    // establishWebSocket();
  });

  onDestroy(() => {
    clearInterval(refreshTimer); // Clear the timer when the component is destroyed
  });
</script>

<div
  class="dboard__grid__item dboard__grid__item--bottom-right current-music flowover"
>
  {#if art && !modal}
    <!-- <div
      class="current-music__info flex flex-col"
      transition:blur={{ amount: 10 }}
    >
      <h1>{title}</h1>
      <h2>{artist}</h2>
      <h3>{album}</h3>
    </div> -->
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <img
      src={art}
      alt="{album} Artwork"
      onclick={toggleModal}
      onkeydown={toggleModal}
      role="switch"
      tabindex="0"
      aria-checked="false"
      class="transition-opacity {transitionImages
        ? 'opacity-0'
        : 'opacity-100'}"
      transition:fade={{ easing: cubicInOut }}
    />
  {/if}
</div>

{#if art && modal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="current-music__modal"
    transition:fade
    onclick={toggleModal}
    onkeydown={toggleModal}
    role="switch"
    tabindex="-1"
    aria-checked={modal}
  >
    <header>
      <div class="reading">
        <h1 class="current-music__modal__headline bg">
          {headlineValue1}
        </h1>
        <h2 class="text-md">{trend} | {difference}</h2>
      </div>
      <div class="reading">
        <h1 class="current-music__modal__headline">
          {typeof weather?.temperature_2m === 'number'
            ? Math.round(weather?.temperature_2m)
            : weather?.temperature_2m}ºF
        </h1>
        <h2 class="text-md">&nbsp;</h2>
      </div>
    </header>
    <main class="flex w-[77%] flex-col content-center items-center">
      <div class="album-art">
        <LovedHeart {loved} size={77} />
        <img src={art} alt="{album} Artwork" transition:fade />
      </div>
      <div
        class="current-music__modal__info flex flex-col"
        transition:blur={{ amount: 10 }}
      >
        <h2>{artist}</h2>
        <h2>&bull;</h2>
        <h3>{album}</h3>
      </div>
      <h1 class="text-3xl text-white">{title}</h1>
      <AudioWave />
    </main>
  </div>
{/if}
