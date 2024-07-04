<script lang="ts">
  import { fade } from 'svelte/transition';
  import { addHtmlLineBreaks } from '$utils/strings';
  import { formatSecondsToMinutes } from '$utils/strings';
  import LovedHeart from '$components/Animations/LovedHeart.svelte';

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
  }: Props = $props();
</script>

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
        <h3 class="album-title">{@html addHtmlLineBreaks(album)}</h3>
        <LovedHeart {loved} size={33} />
      </div>
      <div class="track-details">
        <span class="track-artist">
          <h2 class="artist">{@html addHtmlLineBreaks(artist)}</h2>
        </span>
        <span class="track">
          <h3 class="track-time">
            {#if timer <= 0}∞{:else}{formatSecondsToMinutes(
                totalSeconds - timer
              )}{/if}
          </h3>
          <h1 class="track-title">{@html addHtmlLineBreaks(title)}</h1>
        </span>
      </div>
    </div>
  {/key}
</div>
