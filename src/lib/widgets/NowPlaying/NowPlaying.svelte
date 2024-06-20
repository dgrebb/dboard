<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { createWidget, homeState } from '$lib/stores';

  import { clickOutside } from '$lib/actions/clickOutside';
  import {
    TypeOfWidget,
    isNightScoutData,
    type NowPlayingData,
    type WeatherData,
  } from '$root/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { fade, blur } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  let weather = $derived(homeState.getCurrentWeather());
  import { mapNightScoutDirectionIcon } from '$root/lib/_helpers/directionIconMap';
  import Icon from '@iconify/svelte';
  import { healthState } from '$root/lib/stores/health.svelte';
  import { Button } from 'flowbite-svelte';
  import AudioControls from './AudioControls.svelte';

  let loaded = $state(false);
  const resubscribeInterval = 3600000; // Resubscribe every hour
  let resubscribeTimeout: NodeJS.Timeout;
  let retryTimeout: NodeJS.Timeout;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  let np: NowPlayingData = homeState.getNowPlaying();
  let title = $state('');
  let album = $state('');
  let artist = $state('');
  let loved = $state(false);
  let art = $state('/album_art.png');
  let modal = $state(false);
  let trend = $state(0);
  let difference: string | number = $state('0');
  let direction = 'Flat';
  let directionIcon = $state(mapNightScoutDirectionIcon());
  let currentValue = $state(0);

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

  function toggleModal(event: Event, state: boolean | undefined = undefined) {
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
    loaded = true;
    window.addEventListener('beforeunload', handleWindowUnload);
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
    if (loaded) {
      const currentData = healthState.getCurrentData() || false;
      if (currentData !== false) {
        directionIcon = healthState.getDirectionIcon();
        ({ trend, direction, sgv: currentValue } = currentData);
        difference = healthState.getDifference();
      }
      ({ artist, album, title, loved, art } = homeState.getNowPlaying());
    }
  });
</script>

<div
  class="now-playing dboard__grid__item dboard__grid__item--bottom-right current-music flowover"
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
    <AudioControls />
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    {#key art}
      <div
        class="album-art"
        out:fade={{ duration: 333 }}
        in:fade={{ duration: 333, delay: 333 }}
      >
        <LovedHeart {loved} size={33} />
        <img
          src={art}
          alt="{album} Artwork"
          onclick={(e) => toggleModal(e, true)}
          onkeydown={(e) => toggleModal(e, true)}
          role="switch"
          tabindex="0"
          aria-checked="false"
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
  >
    <header>
      <div class="reading">
        <h1 class="current-music__modal__headline bg">
          {currentValue}
        </h1>
        <h2 class="text-md">
          {difference} |
          <Icon
            icon={directionIcon}
            height="32px"
            class="inline-flex align-middle"
          />
        </h2>
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
      <AudioControls />
      {#key art}
        <div class="album-art">
          <LovedHeart {loved} size={77} />
          <img
            src={art}
            alt="{album} Artwork"
            out:fade={{ duration: 333 }}
            in:fade={{ duration: 333, delay: 333 }}
            use:clickOutside={(e) => {
              hideModal(e);
            }}
          />
        </div>
      {/key}
      <div
        class="current-music__modal__info flex"
        transition:blur={{ amount: 10 }}
      >
        <h2>{artist}</h2>
        <h2>&bull;</h2>
        <h3>{album}</h3>
      </div>
      <h1 class="text-3xl text-white">{title}</h1>
      <!-- <AudioWave /> -->
    </main>
  </div>
{/if}
