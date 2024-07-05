<script lang="ts">
  import { selfOffsetBackground } from '$actions/selfOffsetBackground';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import type { CurrentWeatherData } from '$lib/types';
  import { addHtmlLineBreaks } from '$utils/strings';
  import Icon from '@iconify/svelte';
  import { blur, fade } from 'svelte/transition';
  import PlaybackControls from './PlaybackControls.svelte';
  import PlayHead from './TrackProgress.svelte';
  import { homeState } from '$lib/stores';
  import SafeHtml from '$components/SafeHTML.svelte';

  type Props = {
    currentValue: number | null;
    difference: string | number;
    direction: string | null;
    directionIcon: string;
    locationName: string;
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
    currentValue,
    difference,
    direction,
    directionIcon,
    locationName,
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

  let temperature: CurrentWeatherData['temperature_2m'] = $state(
    homeState.currentRoundTemperature()
  );

  $effect(() => {
    temperature = homeState.currentRoundTemperature();
  });
</script>

{#if modal}
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
      {#key currentValue}
        <div class="reading nightscout-reading" in:fade>
          <h1
            class="current-music__modal__headline bg"
            use:selfOffsetBackground
          >
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
      {#key temperature}
        <div
          class="reading weather-reading"
          in:blur={{ duration: 500, delay: 500 }}
          out:blur={{ duration: 500 }}
        >
          <h1 class="current-music__modal__headline" use:selfOffsetBackground>
            {temperature}ºF
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
            <img
              src={newArt}
              alt="{album} Artwork"
              in:fade={{ duration: 500 }}
            />
          {/if}
        </div>
      </div>

      {#key album}
        <h3
          class="album-title text-fuchsia-200"
          out:fade={{ duration: 500 }}
          in:fade={{ duration: 500, delay: 500 }}
        >
          <SafeHtml html={addHtmlLineBreaks(album)} />
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
        >
          <button
            class="refresh-gradient"
            onclick={(e: MouseEvent) => handleGradientRefresh(e)}
          >
            <Icon icon="solar:soundwave-bold-duotone" width={50} /></button
          >
          <h2 class="artist" use:selfOffsetBackground>
            <SafeHtml html={addHtmlLineBreaks(artist)} />
          </h2>
          <h1 class="title" use:selfOffsetBackground>
            <SafeHtml html={addHtmlLineBreaks(title)} />
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
{/if}
