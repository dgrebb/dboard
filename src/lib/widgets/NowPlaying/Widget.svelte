<script lang="ts">
  import { blur } from 'svelte/transition';
  import { addHtmlLineBreaks } from '$utils/strings';
  import { formatSecondsToMinutes } from '$utils/strings';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
  import SafeHtml from '$components/SafeHTML.svelte';

  type Props = {
    artist: string;
    title: string;
    album: string;
    previousAlbum: string;
    art: string;
    loved: boolean;
    modal: boolean;
    timer: number;
    totalSeconds: number;
    transitionGradient: boolean;
    toggleModal: (e: MouseEvent) => void;
  };

  let {
    previousAlbum,
    art,
    artist,
    title,
    album,
    loved,
    modal,
    timer,
    totalSeconds,
    toggleModal,
    transitionGradient,
  }: Props = $props();
</script>

<div class="now-playing dboard__grid__item current-music">
  <div
    class="dboard__card svelte-1s7u7zs refreshed w-full border-none bg-transparent"
    class:transitionGradient
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    {#key album !== previousAlbum}
      <div
        class="album-art"
        out:blur={{ duration: 2000 }}
        in:blur={{ duration: 2000, delay: 2000 }}
      >
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <img
          src={art}
          alt="{album} Artwork"
          onclick={(e) => toggleModal(e)}
          tabindex="-1"
          role="switch"
          aria-checked={modal}
        />
        <h3 class="album-title">
          <SafeHtml html={addHtmlLineBreaks(album)} />
        </h3>
        <LovedHeart {loved} size={33} />
      </div>
    {/key}
    {#key album !== previousAlbum}
      <div
        class="track-details"
        out:blur={{ duration: 2000 }}
        in:blur={{ duration: 2000, delay: 2000 }}
      >
        <span class="track-artist">
          <h2 class="artist"><SafeHtml html={addHtmlLineBreaks(artist)} /></h2>
        </span>
        <span class="track">
          <h3 class="track-time">
            {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                totalSeconds - timer
              )}{/if}
          </h3>
          <h1 class="track-title">
            <SafeHtml html={addHtmlLineBreaks(title)} />
          </h1>
        </span>
      </div>
    {/key}
  </div>
</div>
