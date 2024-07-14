<script lang="ts">
  import { musicState } from '$lib/stores';
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
  let art = $state('/missing-album-art.png');
  let { backgroundGradient, foregroundGradient }: GradientResult = $state(
    musicState.gradients()
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
  let currentArt: string | null = $state(musicState.nowPlayingArt());
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
        imageCache.set(url, true);
        cacheOrder.push(url);

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

  async function setupEventSource() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = async (event) => {
      const data = await JSON.parse(event.data);
      if (data.artist && data.album && data.title) {
        ({
          artist,
          album,
          title,
          art,
          totalTime,
          foregroundGradient,
          backgroundGradient,
          relativeTimePosition,
        } = data);

        timer = 0;
        let currentSeconds = timeStringToSeconds(
          relativeTimePosition?.toString()
        );
        totalSeconds = timeStringToSeconds(totalTime?.toString());
        let time = totalSeconds - currentSeconds;
        keepTime(time, totalSeconds);

        let cachebust = Math.round(Date.now() / 1000);

        if (art.includes('?')) {
          art = art + `&bust=${cachebust}`;
        } else {
          art = art + `?bust=${cachebust}`;
        }

        preloadImage(art)
          .then(() => {
            newArt = art;
          })
          .catch((error) => {
            console.error('Image failed to load', error);
          });

        await musicState.setNowPlaying(data);
        retryCount = 0;
      } else if (data.loved !== undefined) {
        loved = data.loved;
        musicState.setLoved(data.loved);
      } else if (data.backgroundGradient && data.foregroundGradient) {
        console.log('🚀 ~ eventSource.onmessage= ~ data:', data);
        musicState.setGradients({
          backgroundGradient: data.backgroundGradient,
          foregroundGradient: data.foregroundGradient,
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);

      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = window.setTimeout(() => {
        setupEventSource();
      }, retryDelay) as unknown as number;
    };

    eventSource.onopen = () => {
      console.info('EventSource connection opened.');
      retryCount = 0;
    };

    eventSource.addEventListener('heartbeat', () => {
      console.info('Received heartbeat from server');
    });

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

  $effect(() => {
    const delay = 3300;
    transitionGradient = true;
    transitionForegroundGradient = true;
    const back = musicState.gradients().backgroundGradient.toString();
    const fore = musicState.gradients().foregroundGradient.toString();
    setGradientCSSVars('next', back, fore);
    console.log('🚀 ~ $effect ~ back:', back);

    setTimeout(() => {
      setGradientCSSVars('previous', back, fore);
      currentArt = art;
      transitionGradient = false;
      transitionForegroundGradient = false;
      newArt = undefined;
    }, delay);
    loaded = true;
  });

  $effect(() => {
    return () => {
      transitionGradient = false;
      transitionForegroundGradient = false;
      previousAlbum = album;
    };
  });

  $effect(() => {
    const currentHealthData = healthState.getCurrentData() || false;
    if (currentHealthData !== false) {
      directionIcon = healthState.getDirectionIcon();
      ({ direction, sgv: currentValue } = currentHealthData);
      difference = healthState.getDifference();
    }
  });

  const setGradientCSSVars = (
    which: 'next' | 'previous',
    back: string,
    fore: string
  ) => {
    const body = document.body;
    body.style.setProperty(`--${which}BackgroundGradient`, back);
    body.style.setProperty(`--${which}ForegroundGradient`, fore);
  };

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
    stopEventSource();
  }

  const handlePushing = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = true;
    refreshed = false;
  };

  const handleUp = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    pushing = false;

    handleGradientRefresh(e);

    stopEventSource();
    setupEventSource();

    refreshed = true;
  };

  function toggleModal(e: MouseEvent | TouchEvent) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    const active = !uiState.modal().isActive;
    uiState.setModal({
      isActive: active,
      component: 'music',
    });
    localStorage.setItem('musicModal', active.toString());
  }

  const handleGradientRefresh = async (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e instanceof MouseEvent && e.button === 2) return;
    try {
      const response = await fetch('/api/stream/music?generateGradient=true');
      const result = await response.json();
      if (result.success && result.gradient) {
        musicState.setGradients(result.gradient);
      }
    } catch (error) {
      console.error('Failed to generate gradient:', error);
    }
  };

  onMount(async () => {
    await setupEventSource();
    if (localStorage.getItem('musicModal') === 'true') {
      modal.isActive = true;
    }
    window.addEventListener('beforeunload', handleWindowUnload);
  });

  onDestroy(() => {
    stopEventSource();
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
    {setupEventSource}
    {stopEventSource}
  />
{/if}
