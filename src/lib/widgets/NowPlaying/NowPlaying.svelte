<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { healthState, homeState } from '$lib/stores';
  import { mapNightScoutDirectionIcon } from '$utils/nightscout';
  import Icon from '@iconify/svelte';
  import { onDestroy, onMount } from 'svelte';
  import { cubicInOut } from 'svelte/easing';
  import { blur, fade } from 'svelte/transition';
  import AudioControls from './AudioControls.svelte';

  const resubscribeInterval = 3600000; // Resubscribe every hour

  let mounted = $state(false);
  let loaded = $state(false);
  let weather = $derived(homeState.currentWeather());
  let resubscribeTimeout: NodeJS.Timeout;
  let retryTimeout: NodeJS.Timeout;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  let title = $state('');
  let album = $state('');
  let artist = $state('');
  let loved = $state(false);
  let art = $state('/album_art.png');
  let albumGradient = $derived(homeState.albumGradient());
  let modal = $state(false);
  let difference: string | number = $state('0');
  let direction = $state('Flat');
  let directionIcon = $state(mapNightScoutDirectionIcon());
  let currentValue = $state(0);
  let locationName: string = $derived(homeState.locationName());

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      homeState.setNowPlaying(data);
      retryCount = 0; // Reset retry count on successful message
    };

    eventSource.onerror = (error) => {
      console.log('EventSource error:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = setTimeout(() => {
        startSubscription();
      }, retryDelay);
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = setInterval(() => {
      startSubscription();
    }, resubscribeInterval);
  }

  function handleWindowUnload() {
    console.log('Handling window unload...');
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  }

  function toggleModal(event: Event) {
    event.preventDefault();
    modal = !modal;
    localStorage.setItem('musicModal', modal.toString());
  }

  function hideModal(event: Event) {
    event.preventDefault();
    modal = false;
    localStorage.setItem('musicModal', modal.toString());
  }

  onMount(async () => {
    await startSubscription();
    let modalPreferences =
      localStorage.getItem('musicModal') === 'true' || false;
    modal = modalPreferences;
    window.addEventListener('beforeunload', handleWindowUnload);
    mounted = true;
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  });

  $effect(() => {
    if (mounted) {
      (async () => {
        const currentData = healthState.getCurrentData() || false;
        if (currentData !== false) {
          directionIcon = healthState.getDirectionIcon();
          ({ direction, sgv: currentValue } = currentData);
          difference = healthState.getDifference();
        }
        ({ artist, album, title, loved, art } = homeState.nowPlaying());
      })();
    }
    return () => {
      loaded = true;
    };
  });
</script>

<div
  class="now-playing dboard__grid__item dboard__grid__item--bottom-right current-music flowover"
>
  {#if mounted && loaded}
    {#key art && loaded}
      <div
        class="album-art"
        out:fade={{ duration: 333 }}
        in:fade={{ duration: 333, delay: 333 }}
        onclick={(e) => toggleModal(e)}
        onkeydown={(e) => toggleModal(e)}
        tabindex="-1"
        role="switch"
        aria-checked={modal}
      >
        <LovedHeart {loved} size={33} />
        <img
          src={art}
          alt="{album} Artwork"
          transition:fade={{ easing: cubicInOut }}
        />
      </div>
    {/key}
  {/if}
</div>

{#if modal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="current-music__modal"
    transition:fade
    role="switch"
    tabindex="-1"
    aria-checked={modal}
    onclick={(e) => toggleModal(e)}
    onkeydown={(e) => toggleModal(e)}
    style="--albumGradient: {albumGradient};"
  >
    <header>
      {#key typeof weather?.temperature_2m === 'number' && currentValue !== 0}
        <div class="reading" in:fade>
          <h1 class="current-music__modal__headline bg">
            {currentValue}
          </h1>
          <h2 class="text-md">
            {difference} | {direction}
            <Icon
              icon={directionIcon}
              height="32px"
              class="inline-flex align-middle"
            />
          </h2>
        </div>
        <div class="reading" in:fade>
          <h1 class="current-music__modal__headline">
            {typeof weather?.temperature_2m === 'number'
              ? Math.round(weather?.temperature_2m)
              : weather?.temperature_2m}ºF
          </h1>
          <h2 class="text-md">
            {locationName}
            <Icon
              icon="ion:location-sharp"
              height="32px"
              class="inline-flex align-middle"
            />
          </h2>
        </div>
      {/key}
    </header>
    <main class="items-between flex w-[77%] flex-col md:flex-row">
      <div class="album-art flex pt-3 md:flex-col md:items-start">
        {#key art}
          <LovedHeart {loved} size={77} />
          <img
            src={art}
            alt="{album} Artwork"
            out:blur={{ duration: 150 }}
            in:blur={{ duration: 333 }}
          />
        {/key}
      </div>
      <AudioControls
        classes="audio-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
      />
    </main>
    <footer
      class="current-music__modal__info block text-center text-lg"
      transition:blur={{ amount: 10 }}
    >
      <h2 class="text-fuchsia-200">{title}</h2>
      <h2 class="hidden text-fuchsia-200 md:visible">&bull;</h2>
      <h3 class="text-fuchsia-200">{album}</h3>
      <h1 class="justify-center text-3xl text-white">{artist}</h1>
    </footer>
    <!-- <AudioWave /> -->
  </div>
{/if}
