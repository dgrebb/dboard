<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { healthState, homeState } from '$lib/stores';
  import { mapNightScoutDirectionIcon } from '$utils/nightscout';
  import { timeStringToSeconds } from '$utils/strings';
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
  let title: string = $state('');
  let album: string = $state('');
  let previousAlbum: string = $state('Unknown');
  let artist: string = $state('');
  let loved: boolean = $state(false);
  let totalTime: number = $state(0);
  let relativeTimePosition: number = $state(0);
  let percentComplete: number = $state(0);
  let playState: string = $state('loading');
  let art: string = $state('/missing-album-art.png');
  let gradient: string = $state('/missing-album-art.png');
  let previousGradient = $state(
    'linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0)); --previousGradient: linear-gradient(45deg, rgb(3, 2, 20), rgb(0, 0, 21), rgb(39, 19, 26), rgb(0, 0, 28), rgb(0, 6, 0))'
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
  let transition: boolean = $state(false);
  let timer: number = $state(0);
  let interval: NodeJS.Timeout | null;
  let artFadeThreshhold: boolean = $state(false);
  let trackFadeThreshhold: boolean = $state(false);
  let animationSpeed: number = $state(10000);

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = async (event) => {
      if (interval) {
        clearInterval(interval);
      }
      interval = null;
      const data = JSON.parse(event.data);

      const { totalTime, relativeTimePosition } = data;
      const currentSeconds = timeStringToSeconds(relativeTimePosition);
      const totalSeconds = timeStringToSeconds(totalTime);
      let time = totalSeconds - currentSeconds;
      console.log('🚀 ~ eventSource.onmessage= ~ totalSeconds:', totalSeconds);
      console.log(
        '🚀 ~ eventSource.onmessage= ~ currentSeconds:',
        currentSeconds
      );
      console.log('🚀 ~ eventSource.onmessage= ~ time:', time);
      keepTime(time);
      await homeState.setNowPlaying(data);
      retryCount = 0; // Reset retry count on successful message
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

  const keepTime = (timeRemaining: number) => {
    timer = timeRemaining;
    if (interval) return;
    interval = setInterval(() => {
      timer--;
      if (timer < 10) {
        trackFadeThreshhold = true;
      }
      artFadeThreshhold = trackFadeThreshhold && album !== previousAlbum;
      console.log(
        '🚀 ~ interval=setInterval ~ timer < 10 && album !== previousAlbum:',
        timer > 10 && album !== previousAlbum
      );
    }, 1000);
  };

  const setTrackChange = (state: boolean) => {
    console.log('track change with controls');
    animationSpeed = 3000;
    artFadeThreshhold = state;
    trackFadeThreshhold = state;
  };

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
    const currentHealthData = healthState.getCurrentData() || false;
    if (currentHealthData !== false) {
      directionIcon = healthState.getDirectionIcon();
      ({ direction, sgv: currentValue } = currentHealthData);
      difference = healthState.getDifference();
    }
  });

  $effect(() => {
    const delay = 3333;
    playState = 'starting';
    totalTime = homeState.nowPlayingTotalTime();
    relativeTimePosition = homeState.nowPlayingRelativeTimePosition();
    percentComplete = relativeTimePosition / totalTime;
    ({ artist, album, title, loved, gradient } = homeState.nowPlaying());

    // // console.log('🚀 ~ $effect ~ totalTime:', totalTime);

    setTimeout(async () => {
      previousGradient = gradient;
      previousAlbum = album;
    }, delay);

    transition = true;
    return () => {
      let delay = 5000;
      relativeTimePosition = homeState.nowPlayingRelativeTimePosition();
      loaded = true;
      art = homeState.nowPlayingArt();
      setTimeout(() => {
        transition = false;
        artFadeThreshhold = false;
        trackFadeThreshhold = false;
      }, delay);
    };
  });
</script>

<div
  class="now-playing dboard__grid__item dboard__grid__item--bottom-right current-music flowover"
>
  {#if loaded === true}
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
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="current-music__modal"
    class:transition
    transition:fade
    style="--nextGradient: {gradient}; --previousGradient: {previousGradient};"
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
      {#key artFadeThreshhold === true}
        <div
          class="album-art flex pt-3 md:flex-col md:items-start"
          role="switch"
          tabindex="-1"
          aria-checked={modal}
          onclick={(e) => toggleModal(e)}
          out:blur={{ duration: animationSpeed }}
          in:blur={{ duration: animationSpeed / 2, delay: animationSpeed }}
        >
          <LovedHeart {loved} size={77} />
          <img src={art} alt="{album} Artwork" />
        </div>
      {/key}
      {#if showAudioPlayer === true}
        <div transition:fade class="audio-player">
          <PlaybackControls
            classes="playback-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
            {setTrackChange}
          />
          <PlayHead total={totalTime} current={timer} />
        </div>
      {/if}
    </main>
    {#key art}
      <footer
        class="current-music__modal__info block text-center text-lg"
        out:blur={{ duration: 150 }}
        in:blur={{ duration: 333, delay: 150 }}
      >
        {#key trackFadeThreshhold === true}
          <h2 class="text-fuchsia-200">{title}</h2>
          <h1 class="justify-center text-3xl text-white">{timer}</h1>
          <h2 class="hidden text-fuchsia-200 md:visible">&bull;</h2>
          <h3 class="text-fuchsia-200">{album}</h3>
          <h1 class="justify-center text-3xl text-white">{artist}</h1>
          <!-- <h1 class="justify-center text-3xl text-white">{percentComplete}</h1> -->
        {/key}
      </footer>
    {/key}
    <!-- <AudioWave /> -->
  </div>
{/if}
