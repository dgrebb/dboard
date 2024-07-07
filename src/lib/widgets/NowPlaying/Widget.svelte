<script lang="ts">
  import { blur } from 'svelte/transition';
  import { addHtmlLineBreaks } from '$utils/strings';
  import { formatSecondsToMinutes } from '$utils/strings';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import SafeHtml from '$components/SafeHTML.svelte';
  import type { ModalState } from '$root/lib/types';

  type Props = {
    handlePushing: (e: MouseEvent | TouchEvent) => void;
    handleUp: (e: MouseEvent | TouchEvent) => void;
    pushing: boolean;
    refreshed: boolean;
    artist: string;
    title: string;
    album: string;
    art: string;
    loved: boolean;
    timer: number;
    totalSeconds: number;
    transitionGradient: boolean;
    modal: ModalState;
    toggleModal: (e: MouseEvent) => void;
  };

  let {
    handlePushing,
    handleUp,
    pushing,
    refreshed,
    art,
    artist,
    title,
    album,
    loved,
    timer,
    totalSeconds,
    transitionGradient,
    modal,
    toggleModal,
  }: Props = $props();
</script>

<div
  class="now-playing dboard__grid__item current-music push-to-refresh"
  onmousedown={(e) => handlePushing(e)}
  onmouseup={(e) => handleUp(e)}
  ontouchstart={(e) => handlePushing(e)}
  ontouchend={(e) => handleUp(e)}
  tabindex="-1"
  role="button"
>
  {#key art}
    <div
      class="dboard__card svelte-1s7u7zs refreshed w-full border-none bg-transparent"
      class:transitionGradient
      class:pushing
      class:refreshed
    >
      <div
        class="album-art"
        out:blur={{ duration: 500 }}
        in:blur={{ duration: 500, delay: 500 }}
      >
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
          src={art}
          alt="{album} Artwork"
          onclick={(e) => toggleModal(e)}
          tabindex="-1"
          role="switch"
          aria-checked={modal.isActive}
        />
        <h3 class="album-title">
          <SafeHtml html={addHtmlLineBreaks(album)} />
        </h3>
        <LovedHeart {loved} size={33} />
      </div>
      <div
        class="track-details"
        out:blur={{ duration: 500 }}
        in:blur={{ duration: 500, delay: 500 }}
      >
        <span class="track-artist"
          ><h2 class="artist">
            <SafeHtml html={addHtmlLineBreaks(artist)} />
          </h2></span
        >
        <span class="track"
          ><h3 class="track-time">
            {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                totalSeconds - timer
              )}{/if}
          </h3>
          <h1 class="track-title">
            <SafeHtml html={addHtmlLineBreaks(title)} />
          </h1></span
        >
      </div>
    </div>
  {/key}
</div>
