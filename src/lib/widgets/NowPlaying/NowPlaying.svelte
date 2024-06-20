<script lang="ts">
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import { createWidget, homeState } from '$lib/stores';
  import { generateID, toCamelCase } from '$lib/_helpers/strings';
  import {
    TypeOfWidget,
    type NowPlayingData,
    type WeatherData,
  } from '$root/lib/types';
  import { onDestroy, onMount } from 'svelte';

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

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/stream/music`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('🚀 ~ startSubscription ~ data:', data);
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

  onMount(async () => {
    await startSubscription();
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
    ({ artist, album, title, loved, art } = homeState.getNowPlaying());
  });

  // let weather: WeatherData = $state(homeState.getWeather());
</script>

{#if np}
  <div class="now-playing dboard__grid__item relative text-white">
    <!-- <h1 class="text-3xl">{weather?.current?.temperature_2m}</h1> -->
    <h1>{artist}</h1>
    <h1>{title}</h1>
    <h1>{album}</h1>
    <div class="album-art relative inline-block">
      <LovedHeart {loved} size={33} />
      <img
        class="h-[200px]"
        src={art}
        alt={`Artwork for the album ${album} by ${artist}`}
      />
    </div>
  </div>
{/if}
