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
  let gradient = $state(homeState.nowPlayingGradient());
  let previousGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0)); --previousGradient: linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
  );
  let modal = $state(localStorage.getItem('musicModal') === 'true' || false);
  let difference: string | number = $state('0');
  let direction = $state('Flat');
  let directionIcon = $state(mapNightScoutDirectionIcon());
  let currentValue = $state(0);
  let locationName: string = $derived(homeState.locationName());
  let transition: boolean = $state(false);

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      await homeState.setNowPlaying(data);
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

  onMount(async () => {
    await startSubscription();
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
      const currentHealthData = healthState.getCurrentData() || false;
      const delay = 3333;
      if (currentHealthData !== false) {
        directionIcon = healthState.getDirectionIcon();
        ({ direction, sgv: currentValue } = currentHealthData);
        difference = healthState.getDifference();
      }
      ({ artist, album, title, loved, gradient } = homeState.nowPlaying());

      setTimeout(async () => {
        previousGradient = gradient;
      }, delay);
      transition = true;
    }
    return () => {
      loaded = true;
      let delay = 5000;
      art = homeState.nowPlayingArt();
      setTimeout(() => {
        transition = false;
      }, delay);
    };
  });
</script>

<div
  class="now-playing dboard__grid__item dboard__grid__item--bottom-right current-music flowover"
>
  {#if mounted && loaded}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    {#key art}
      <div
        class="album-art"
        out:fade={{ duration: 333 }}
        in:fade={{ duration: 333, delay: 333 }}
      >
        <LovedHeart {loved} size={33} />
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <img
          src={art}
          alt="{album} Artwork"
          onclick={(e) => toggleModal(e)}
          tabindex="-1"
          role="switch"
          aria-checked={modal}
        />
      </div>
    {/key}
  {/if}
</div>

{#if modal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="current-music__modal"
    class:transition
    transition:fade
    style="--nextGradient: {gradient}; --previousGradient: {previousGradient};"
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
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="album-art flex pt-3 md:flex-col md:items-start"
        role="switch"
        tabindex="-1"
        aria-checked={modal}
        onclick={(e) => toggleModal(e)}
      >
        {#key art}
          <LovedHeart {loved} size={77} />
          <img
            src={art}
            alt="{album} Artwork"
            out:blur={{ duration: 150 }}
            in:blur={{ duration: 333, delay: 150 }}
          />
        {/key}
      </div>
      <AudioControls
        classes="audio-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
      />
    </main>
    {#key art}
      <footer
        class="current-music__modal__info block text-center text-lg"
        out:blur={{ duration: 150 }}
        in:blur={{ duration: 333, delay: 150 }}
      >
        <h2 class="text-fuchsia-200">{title}</h2>
        <h2 class="hidden text-fuchsia-200 md:visible">&bull;</h2>
        <h3 class="text-fuchsia-200">{album}</h3>
        <h1 class="justify-center text-3xl text-white">{artist}</h1>
      </footer>
    {/key}
    <!-- <AudioWave /> -->
  </div>
{/if}
