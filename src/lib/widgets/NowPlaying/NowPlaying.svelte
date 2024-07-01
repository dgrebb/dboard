<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { healthState, homeState } from '$lib/stores';
  import { mapNightScoutDirectionIcon } from '$utils/nightscout';
  import { timeStringToSeconds, formatSecondsToMinutes } from '$utils/strings';
  import Icon from '@iconify/svelte';
  import { onDestroy, onMount } from 'svelte';
  import { blur, crossfade, fade, fly } from 'svelte/transition';
  import PlaybackControls from './PlaybackControls.svelte';
  import PlayHead from './PlayHead.svelte';
  import { quintOut } from 'svelte/easing';
  import type { GradientResult } from '$lib/types';
  import { areTimesCloserTogether } from '$utils/timecodes';

  const resubscribeInterval = 3600000; // Resubscribe every hour

  let mounted = $state(false);
  let loaded = $state(false);
  let weather = $derived(homeState.currentWeather());
  let resubscribeTimeout: NodeJS.Timeout;
  let retryTimeout: NodeJS.Timeout;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  let title: string = $state('');
  let album: string = $state('');
  let artist: string = $state('');
  let loved: boolean = $state(false);
  let totalTime: string | number = $state(0);
  let totalSeconds: number = $state(0);
  let relativeTimePosition: string | number = $state(0);
  let playState: string = $state('loading');
  let art: string = $state('/missing-album-art.png');
  let { backgroundGradient, foregroundGradient }: GradientResult = $state(
    homeState.nowPlayingGradients()
  );
  let modal: boolean = $state(
    localStorage.getItem('musicModal') === 'true' || false
  );
  let difference: string | number = $state('0');
  let direction: string | null = $state('Flat');
  let directionIcon: string = $state(mapNightScoutDirectionIcon());
  let currentValue: number | null = $state(0);
  let locationName: string | null = $derived(homeState.locationName());

  let showAudioPlayer: boolean = $state(false);
  let transitionGradient: boolean = $state(false);
  let timer: number = $state(0);
  let timeInterval: NodeJS.Timeout | null = $state(null);
  let previousAlbum: string = $state('Unknown');
  let currentArt: string | null = $state('/missing-album-art.png');
  let newArt: string | null = $state(null);
  let previousBackgroundGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
  );
  let previousForegroundGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
  );

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = (error) => reject(error);
    });
  };

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = async (event) => {
      timer = 0;
      const data = await JSON.parse(event.data);
      // console.log('🚀 ~ eventSource.onmessage= ~ data:', data);
      const ipAddressPattern =
        /^(https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;

      ({ artist, album, title, art, totalTime, relativeTimePosition } = data);
      let currentSeconds = timeStringToSeconds(
        relativeTimePosition?.toString()
      );

      totalSeconds = timeStringToSeconds(totalTime?.toString());

      let time = totalSeconds - currentSeconds;
      keepTime(time, totalSeconds);

      art = art.includes('/data/AirplayArtWorkData.png')
        ? (art = art.replace(ipAddressPattern, ''))
        : art;

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

    /**
     * Keeps track of the remaining time for the track and updates the timer.
     * @param {number} timeRemaining - The time remaining for the track in seconds.
     */
    const keepTime = (timeRemaining: number, totalTime: number) => {
      timer = timeRemaining < 5 ? totalTime : timeRemaining;
      if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
      }
      timeInterval = setInterval(() => {
        timer--;
        if (timer < 5) {
          // console.log('start fading');
        }
        // console.log(timer);
      }, 1000);
    };
  }

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

    // console.log('🚀 ~ $effect ~ gradient:', gradient);
    // console.log('🚀 ~ $effect ~ backgroundGradient:', backgroundGradient);
    // console.log('🚀 ~ $effect ~ foregroundGradient:', foregroundGradient);
    transitionGradient = true;

    preloadImage(art)
      .then(() => {
        newArt = art;
      })
      .catch((error) => {
        console.error('Image failed to load', error);
      });

    return () => {
      loaded = true;
      previousAlbum = album;
      setTimeout(() => {
        currentArt = art;
        // console.log('this is where the secong gradient animation fires');
        transitionGradient = false;
        previousBackgroundGradient = backgroundGradient;
        previousForegroundGradient = foregroundGradient;
        // transitionArt = false;
      }, delay);
      setTimeout(() => {
        newArt = null;
      }, delay + 1000);
    };
  });

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

  function toggleModal(e: MouseEvent) {
    e.preventDefault();
    modal = !modal;
    localStorage.setItem('musicModal', modal.toString());
  }

  const toggleControls = (e: MouseEvent) => {
    e.preventDefault();
    showAudioPlayer = !showAudioPlayer;
  };

  const setTrackChange = () => {
    // console.log('track change with controls');
    // timeInterval = null;
    // timer = 0;
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

{#if loaded === true}
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

{#if modal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="current-music__modal"
    class:transitionGradient
    transition:fade
    style="--nextBackgroundGradient: {backgroundGradient}; --previousBackgroundGradient: {previousBackgroundGradient}; --nextForegroundGradient: {foregroundGradient}; --previousForegroundGradient: {previousForegroundGradient}; "
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
          {#key currentArt}
            <img src={currentArt} alt="{album} Artwork" transition:fade />
          {/key}
          {#if newArt}
            <img src={newArt} alt="{album} Artwork" transition:fade />
          {/if}
        </div>
      </div>
      <h3 class="album-title text-fuchsia-200">{album}</h3>
      {#if showAudioPlayer === true}
        <div transition:fade class="audio-player">
          <PlaybackControls
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
      {#if timer}
        <PlayHead
          total={typeof totalSeconds === 'number' ? totalSeconds : 0}
          current={timer}
        />
      {/if}
      {#key title}
        <div
          class="track-info"
          in:blur={{ duration: 333, delay: 333 }}
          out:blur={{ duration: 333 }}
          class:transitionGradient
        >
          <Icon icon="solar:soundwave-bold-duotone" width={50} />
          <h2 class="artist">{artist}</h2>
          <h1 class="title">{title}</h1>
          <h3 class="track-time">
            <!-- {#if timer <= 0}∞{:else}{formatSecondsToMinutes(timer)}{/if} -->
            {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                totalSeconds - timer
              )}{/if}
          </h3>
        </div>
      {/key}
      <div
        transition:fade
        class="audio-player"
        class:expanded={showAudioPlayer}
      >
        <PlaybackControls
          classes="playback-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
          {setTrackChange}
        />
      </div>
    </footer>
  </div>
{/if}
