<script lang="ts">
  import { healthState, homeState, uiState } from '$lib/stores';
  import type { GradientResult, ModalState, Timer } from '$lib/types';
  import { mapNightScoutDirectionIcon } from '$utils/nightscout';
  import { timeStringToSeconds } from '$utils/strings';
  import { onDestroy, onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import Widget from './Widget.svelte';

  const resubscribeInterval = 3600000; // Resubscribe every hour

  let loaded = $state(false);
  let resubscribeTimeout: number;
  let retryTimeout: number;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  let title = $state('');
  let album = $state('');
  let artist = $state('');
  let loved = $state(false);
  let totalTime: string | number = $state(0);
  let totalSeconds = $state(0);
  let relativeTimePosition: string | number = $state(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let playState = $state('loading');
  let art = $state('/missing-album-art.png');
  let { backgroundGradient, foregroundGradient }: GradientResult = $state(
    homeState.nowPlayingGradients()
  );
  let modal: ModalState = $state(uiState.modal());
  let pushing = $state(false);
  let refreshed = $state(true);
  let difference: string | number = $state('0');
  let direction: string | null = $state('Flat');
  let directionIcon = $state(mapNightScoutDirectionIcon());
  let currentValue: number | null = $state(0);
  let locationName: string | null = $derived(homeState.locationName());

  let transitionGradient = $state(false);
  let transitionForegroundGradient = $state(false);
  let timer = $state(0);
  let timeInterval: Timer | null = $state(null);
  let previousAlbum = $state('Unknown');
  let currentArt: string | null = $state(homeState.nowPlayingArt());
  let newArt: string | undefined = $state(undefined);

  const imageCache = new Map<string, boolean>();
  const cacheOrder: string[] = [];

  /**
   * Preloads an image and returns a promise that resolves when the image is loaded.
   * Stores the last three images by default.
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
        // Add the image URL to the cache
        imageCache.set(url, true);
        cacheOrder.push(url);

        // Ensure only the last 3 images are stored
        if (cacheOrder.length > 3) {
          const oldestUrl = cacheOrder.shift();
          if (oldestUrl) {
            imageCache.delete(oldestUrl);
          }
        }

        resolve();
      };
      img.onerror = (error) => reject(error);
    });
  };

  /**
   * Starts the subscription to the music event source.
   */
  async function setupEventSource() {
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

      art =
        (art.includes('/data/AirplayArtWorkData.png')
          ? art.replace(ipAddressPattern, '')
          : art) + `?bust=${Math.round(Date.now() / 1000)}`;

      await homeState.setNowPlaying(data);
      retryCount = 0;
      loaded = true;
    };

    eventSource.onerror = (error) => {
      console.info('EventSource error:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = window.setTimeout(() => {
        setupEventSource();
      }, retryDelay) as unknown as number;
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = window.setInterval(() => {
      setupEventSource();
    }, resubscribeInterval);
  }

  function stopEventSource() {
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

  const handlePushing = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = true;
    refreshed = false;
  };

  const handleUp = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = false;

    // current = weatherWidget.current();

    // Reload EventSource
    stopEventSource();
    setupEventSource();

    refreshed = true;
  };

  function toggleModal(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const active = !uiState.modal().isActive;
    uiState.setModal({
      isActive: active,
      component: 'music',
    });
    localStorage.setItem('musicModal', active.toString());
  }

  const handleGradientRefresh = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    e.preventDefault();
    e.stopPropagation();
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
    const body = document.body;
    const delay = 3333;
    ({ backgroundGradient, foregroundGradient } =
      homeState.nowPlayingGradients());
    body.style.setProperty('--nextBackgroundGradient', backgroundGradient);
    body.style.setProperty('--nextForegroundGradient', foregroundGradient);
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

    body.style.setProperty('--previousForegroundGradient', foregroundGradient);
    return () => {
      loaded = true;
      previousAlbum = album;
      setTimeout(() => {
        transitionForegroundGradient = false;
      }, 500);
      setTimeout(() => {
        currentArt = art;
        transitionGradient = false;
        body.style.setProperty(
          '--previousBackgroundGradient',
          backgroundGradient
        );
      }, delay);
      setTimeout(() => {
        newArt = undefined;
      }, delay + 1000);
    };
  });

  onMount(async () => {
    setTimeout(() => {
      setupEventSource();
    }, 1000);
    if (localStorage.getItem('musicModal') === 'true') {
      modal.isActive = true;
    }
    window.addEventListener('beforeunload', handleWindowUnload);
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

{#if loaded}
  <Widget
    {handlePushing}
    {handleUp}
    {artist}
    {album}
    {art}
    {title}
    {loved}
    {timer}
    {totalSeconds}
    {transitionGradient}
    {modal}
    {toggleModal}
    {pushing}
    {refreshed}
  />

  <Modal
    {artist}
    {album}
    {art}
    {newArt}
    {currentArt}
    {previousAlbum}
    {title}
    {loved}
    {timer}
    {totalSeconds}
    {transitionGradient}
    {transitionForegroundGradient}
    {currentValue}
    {difference}
    {direction}
    {directionIcon}
    {locationName}
    {handleGradientRefresh}
    {modal}
    {toggleModal}
  />
{/if}
