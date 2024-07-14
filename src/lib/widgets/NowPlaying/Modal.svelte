<script lang="ts">
  import { selfOffsetBackground } from '$actions/selfOffsetBackground';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import SafeHtml from '$components/SafeHTML.svelte';
  import { homeState, uiState } from '$lib/stores';
  import type { CurrentWeatherData, ModalState } from '$types';
  import { addHtmlLineBreaks } from '$utils/strings';
  import Icon from '@iconify/svelte';
  import { blur, fade } from 'svelte/transition';
  import PlaybackControls from './PlaybackControls.svelte';
  import PlayHead from './TrackProgress.svelte';

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
    timer: number;
    totalSeconds: number;
    transitionForegroundGradient: boolean;
    transitionGradient: boolean;
    handleGradientRefresh: (e: MouseEvent | TouchEvent) => Promise<void>;
    modal: ModalState;
    toggleModal: (e: MouseEvent) => void;
    setupEventSource: () => Promise<void>;
    stopEventSource: () => void;
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
    timer,
    totalSeconds,
    handleGradientRefresh,
    transitionGradient,
    transitionForegroundGradient,
    toggleModal,
  }: Props = $props();

  let temperature: CurrentWeatherData['temperature_2m'] = $state(
    homeState.currentRoundTemperature()
  );

  let modal = $state(uiState.modal());
  let showControls = $state(false);
  let showHud = $state(false);

  // Handle track change with controls
  const setTrackChange = (e: TouchEvent | MouseEvent) => {
    e.preventDefault;
    e.stopPropagation();
    showControls = false;
  };

  const toggleControls = (e: TouchEvent | MouseEvent) => {
    e.stopPropagation();
    showControls = !showControls;
  };

  const toggleHud = (e: TouchEvent | MouseEvent) => {
    e.stopPropagation();
    showHud = !showHud;
    showHud === false ? (showControls = false) : null;
  };

  $effect(() => {
    modal = uiState.modal();
  });

  $effect(() => {
    temperature = homeState.currentRoundTemperature();
  });
</script>

{#if modal.isActive}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="current-music__modal"
    class:transitionGradient
    transition:fade={{ duration: 500 }}
    onclick={async (e) => await handleGradientRefresh(e)}
  >
    <header>
      {#key currentValue}
        <div class="reading nightscout-reading" in:fade class:showHud>
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
          transition:blur={{ duration: 500 }}
          class:showHud
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
      <div
        class="album-art"
        role="switch"
        tabindex="-1"
        aria-checked={modal.isActive}
        onclick={(e) => toggleModal(e)}
      >
        <LovedHeart {loved} size={56} />
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
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <h3
          class="album-title text-fuchsia-200"
          out:fade={{ duration: 500 }}
          in:fade={{ duration: 500, delay: 500 }}
          onclick={(e) => toggleHud(e)}
        >
          <SafeHtml html={addHtmlLineBreaks(album)} />
        </h3>
        {#if showControls === true}
          <div
            transition:fade
            class="audio-player"
            class:expanded={showControls}
          >
            <PlaybackControls
              buttonSize={33}
              classes="playback-controls md:w-[33%] justify-center z-10 flex pt-9 py-3 md:pb-3 md:flex-col md:items-end flex-wrap"
              {setTrackChange}
            />
          </div>
        {/if}
      {/key}
    </main>

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <footer
      class="current-music__modal__info block text-center text-lg"
      transition:blur={{ duration: 500 }}
      onclick={(e) => {
        toggleControls(e);
      }}
    >
      {#key title}
        <div
          class="track-info"
          in:blur={{ duration: 500, delay: 500 }}
          out:blur={{ duration: 500 }}
          class:transitionForegroundGradient
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
        {showHud}
      />
    {/key}
  </div>
{/if}
