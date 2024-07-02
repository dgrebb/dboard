<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { healthState, homeState } from '$lib/stores';
  import type { GradientResult } from '$lib/types';
  import { mapNightScoutDirectionIcon } from '$utils/nightscout';
  import { formatSecondsToMinutes, timeStringToSeconds } from '$utils/strings';
  import Icon from '@iconify/svelte';
  import { onDestroy, onMount } from 'svelte';
  import { blur, fade } from 'svelte/transition';
  import PlaybackControls from './PlaybackControls.svelte';
  import PlayHead from './PlayHead.svelte';

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
  let totalTime: string | number = $state(0);
  let totalSeconds = $state(0);
  let relativeTimePosition: string | number = $state(0);
  let playState = $state('loading');
  let art = $state('/missing-album-art.png');
  let { backgroundGradient, foregroundGradient }: GradientResult = $state(
    homeState.nowPlayingGradients()
  );
  let modal = $state(localStorage.getItem('musicModal') === 'true' || false);
  let difference: string | number = $state('0');
  let direction: string | null = $state('Flat');
  let directionIcon = $state(mapNightScoutDirectionIcon());
  let currentValue: number | null = $state(0);
  let locationName: string | null = $derived(homeState.locationName());

  let showAudioPlayer = $state(false);
  let transitionGradient = $state(false);
  let transitionForegroundGradient = $state(false);
  let timer = $state(0);
  let timeInterval: NodeJS.Timeout | null = $state(null);
  let previousAlbum = $state('Unknown');
  let currentArt: string | null = $state(homeState.nowPlayingArt());
  let newArt: string | null = $state(null);
  let previousBackgroundGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
  );
  let previousForegroundGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
  );

  const imageCache = new Map<string, boolean>();

  /**
   * Preloads an image and returns a promise that resolves when the image is loaded.
   * @param {string} url - The URL of the image to preload.
   * @returns {Promise<void>}
   */
  const preloadImage = (url: string): Promise<void> => {
    if (imageCache.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageCache.set(url, true);
        resolve();
      };
      img.onerror = (error) => reject(error);
    });
  };

  /**
   * Starts the subscription to the music event source.
   */
  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = async (event) => {
      const data = await JSON.parse(event.data);
      ({ artist, album, title, art, totalTime, relativeTimePosition } = data);

      const ipAddressPattern =
        /^(https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;

      timer = 0;
      let currentSeconds = timeStringToSeconds(
        relativeTimePosition?.toString()
      );
      totalSeconds = timeStringToSeconds(totalTime?.toString());
      let time = totalSeconds - currentSeconds;
      keepTime(time, totalSeconds);

      art = art.includes('/data/AirplayArtWorkData.png')
        ? art.replace(ipAddressPattern, '')
        : art;
      newArt = art;

      await homeState.setNowPlaying(data);
      retryCount = 0;
      loaded = true;
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

  /**
   * Keeps track of the remaining time for the track and updates the timer.
   * @param {number} timeRemaining - The time remaining for the track in seconds.
   * @param {number} totalTime - The total time of the track in seconds.
   */
  const keepTime = (timeRemaining: number, totalTime: number) => {
    timer = timeRemaining < 5 ? totalTime : timeRemaining;
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
    timeInterval = setInterval(() => {
      timer--;
    }, 1000);
  };

  $effect(() => {
    const currentHealthData = healthState.getCurrentData() || false;
    if (currentHealthData !== false) {
      directionIcon = healthState.getDirectionIcon();
      ({ direction, sgv: currentValue } = currentHealthData);
      difference = healthState.getDifference();
    }
  });

  $effect(() => {
    const delay = 3333;
    ({ backgroundGradient, foregroundGradient } =
      homeState.nowPlayingGradients());
    playState = 'starting';

    preloadImage(art)
      .then(() => {
        newArt = art;
      })
      .catch((error) => {
        console.error('Image failed to load', error);
      });

    transitionGradient = true;
    transitionForegroundGradient = true;

    previousForegroundGradient = foregroundGradient;
    return () => {
      loaded = true;
      previousAlbum = album;
      setTimeout(() => {
        transitionForegroundGradient = false;
      }, 500);
      setTimeout(() => {
        currentArt = art;
        transitionGradient = false;
        previousBackgroundGradient = backgroundGradient;
      }, delay);
      setTimeout(() => {
        newArt = null;
      }, delay + 1000);
    };
  });

  function handleWindowUnload() {
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

  function toggleModal(e: MouseEvent) {
    e.preventDefault();
    modal = !modal;
    localStorage.setItem('musicModal', modal.toString());
  }

  const toggleControls = (e: MouseEvent) => {
    e.preventDefault();
    showAudioPlayer = !showAudioPlayer;
  };

  const setTrackChange = (e: Event) => {
    e.preventDefault;
    // Handle track change with controls
    showAudioPlayer = false;
  };

  onMount(async () => {
    await startSubscription();
    window.addEventListener('beforeunload', handleWindowUnload);
    mounted = true;
    currentArt = art;
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
</script>

d{#if loaded === true}
  <div class="now-playing dboard__grid__item current-music">
    {#key album !== previousAlbum}
      <div
        class="dboard__card svelte-1s7u7zs refreshed w-full border-none bg-transparent"
        out:fade={{ duration: 333 }}
        in:fade={{ duration: 333, delay: 333 }}
      >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="album-art">
          <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
          <img
            src={art}
            alt="{album} Artwork"
            onclick={(e) => toggleModal(e)}
            tabindex="-1"
            role="switch"
            aria-checked={modal}
          />
          <h3 class="album-title">{album}</h3>
          <LovedHeart {loved} size={33} />
        </div>
        <div class="track-details">
          <span class="track-artist">
            <h2 class="artist">{artist}</h2>
          </span>
          <span class="track">
            <h3 class="track-time">
              {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                  totalSeconds - timer
                )}{/if}
            </h3>
            <h1 class="track-title text-fuchsia-200">{title}</h1>
          </span>
        </div>
      </div>
    {/key}
  </div>
{/if}

{#if modal && loaded}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="current-music__modal"
    class:transitionGradient
    transition:fade
    style="--nextBackgroundGradient: {backgroundGradient}; --previousBackgroundGradient: {previousBackgroundGradient}; --nextForegroundGradient: {foregroundGradient}; --previousForegroundGradient: {previousForegroundGradient};"
    onclick={(e) => {
      toggleControls(e);
    }}
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
              icon="line-md:map-marker"
              height="32px"
              class="inline-flex align-middle"
            />
          </h2>
        </div>
      {/key}
    </header>

    <main class="current-music__modal__main">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="album-art flex pt-3 md:flex-col md:items-start"
        role="switch"
        tabindex="-1"
        aria-checked={modal}
        onclick={(e) => toggleModal(e)}
      >
        <LovedHeart {loved} size={77} />
        <div class="image-container">
          {#key currentArt && loaded}
            <img
              src={currentArt}
              alt="{album} Artwork"
              transition:blur={{ duration: 5000, delay: 5000 }}
            />
          {/key}
          {#if newArt}
            <img src={newArt} alt="{album} Artwork" />
          {/if}
        </div>
      </div>
      {#key title}<h3
          class="album-title text-fuchsia-200"
          out:fade={{ duration: 500 }}
          in:fade={{ duration: 500, delay: 500 }}
        >
          {album}
        </h3>{/key}
      {#if showAudioPlayer === true}
        <div
          transition:fade
          class="audio-player"
          class:expanded={showAudioPlayer}
        >
          <PlaybackControls
            buttonSize={33}
            classes="playback-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
            {setTrackChange}
          />
        </div>
      {/if}
    </main>

    <footer
      class="current-music__modal__info block text-center text-lg"
      out:blur={{ duration: 150 }}
      in:blur={{ duration: 333, delay: 150 }}
    >
      <PlayHead
        total={typeof totalSeconds === 'number' ? totalSeconds : 0}
        current={timer}
      />
      {#key title}
        <div
          class="track-info"
          in:blur={{ duration: 500, delay: 500 }}
          out:blur={{ duration: 500 }}
          class:transitionForegroundGradient
        >
          <Icon icon="solar:soundwave-bold-duotone" width={50} />
          <h2 class="artist">{artist}</h2>
          <h1 class="title">{title}</h1>
          <h3 class="track-time">
            {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                totalSeconds - timer
              )}{/if}
          </h3>
        </div>
      {/key}
    </footer>
  </div>
{/if}
