<script lang="ts">
  import { fade, blur } from 'svelte/transition';
  import { addHtmlLineBreaks } from '$utils/strings';
  import { formatSecondsToMinutes } from '$utils/strings';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import Icon from '@iconify/svelte';
  import PlaybackControls from './PlaybackControls.svelte';
  import { selfOffsetBackground } from '$actions/selfOffsetBackground';
  import PlayHead from './TrackProgress.svelte';
  import type { CurrentWeatherData } from '$root/lib/types';

  type Props = {
    loaded: boolean;
    currentValue: number | null;
    difference: string | number;
    direction: string | null;
    directionIcon: string;
    locationName: string;
    weather: undefined | CurrentWeatherData;
    artist: string;
    title: string;
    album: string;
    previousAlbum: string;
    art: string;
    newArt: string | undefined;
    currentArt: string | null;
    loved: boolean;
    modal: boolean;
    showAudioPlayer: boolean;
    timer: number;
    totalSeconds: number;
    transitionForegroundGradient: boolean;
    transitionGradient: boolean;
    toggleModal: (e: MouseEvent) => void;
    toggleControls: (e: MouseEvent) => void;
    setTrackChange: (e: Event) => void;
    handleGradientRefresh: (e: MouseEvent | TouchEvent) => void;
  };

  let {
    loaded,
    currentValue,
    difference,
    direction,
    directionIcon,
    locationName,
    weather,
    newArt,
    currentArt,
    artist,
    title,
    album,
    loved,
    modal,
    showAudioPlayer,
    timer,
    totalSeconds,
    toggleModal,
    handleGradientRefresh,
    transitionGradient,
    transitionForegroundGradient,
    toggleControls,
    setTrackChange,
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="current-music__modal"
  class:transitionGradient
  transition:fade
  onclick={(e) => {
    toggleControls(e);
  }}
>
  <header>
    {#key loaded && currentValue}
      <div class="reading nightscout-reading" in:fade>
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
    {/key}
    {#key loaded && typeof weather?.temperature_2m === 'number' && currentValue !== 0}
      <div
        class="reading weather-reading"
        in:blur={{ duration: 500, delay: 500 }}
        out:blur={{ duration: 500 }}
      >
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
      class="album-art"
      role="switch"
      tabindex="-1"
      aria-checked={modal}
      onclick={(e) => toggleModal(e)}
    >
      <LovedHeart {loved} size={77} />

      <div class="image-container">
        {#key newArt}
          <img
            src={currentArt}
            alt="{album} Artwork"
            out:fade={{ duration: 500 }}
          />
        {/key}
        {#if newArt}
          <img src={newArt} alt="{album} Artwork" in:fade={{ duration: 500 }} />
        {/if}
      </div>
    </div>

    {#key album}
      <h3
        class="album-title text-fuchsia-200"
        out:fade={{ duration: 500 }}
        in:fade={{ duration: 500, delay: 500 }}
      >
        {@html addHtmlLineBreaks(album)}
      </h3>
    {/key}

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
    {#key title}
      <div
        class="track-info"
        in:blur={{ duration: 500, delay: 500 }}
        out:blur={{ duration: 500 }}
        class:transitionForegroundGradient
        onbeforeenter={selfOffsetBackground}
      >
        <button
          class="refresh-gradient"
          onclick={(e: MouseEvent) => handleGradientRefresh(e)}
        >
          <Icon icon="solar:soundwave-bold-duotone" width={50} /></button
        >
        <h2 class="artist" use:selfOffsetBackground>
          {@html addHtmlLineBreaks(artist)}
        </h2>
        <h1 class="title" use:selfOffsetBackground>
          {@html addHtmlLineBreaks(title)}
        </h1>
      </div>
    {/key}
  </footer>

  {#key timer}
    <PlayHead
      total={typeof totalSeconds === 'number' ? totalSeconds : 0}
      current={timer}
    />
  {/key}
</div>
