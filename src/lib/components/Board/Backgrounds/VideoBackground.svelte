<script lang="ts">
  import weather from '$lib/stores/weather';
  import { onMount } from 'svelte';
  let isDay: number, weatherCode;

  type VideoStuff = {
    file: string;
    backgroundColor: string;
  }[];

  $: $weather = weather;

  $: ({ is_day: isDay, weatherCode } = $weather);
  console.log('🚀 ~ $weather:', $weather);

  const dayPlaylist = {
    clear: [
      {
        file: '',
      },
    ],
  };

  const nightPlaylist = {
    clear: [
      {
        file: 'milky-way-mountains.mp4',
        backgroundColor: '#866B66',
      },
      {
        file: 'stars-1.mp4',
        backgroundColor: '#000000',
      },
      {
        file: 'tall-starry-island.mp4',
        backgroundColor: '#1A2232',
      },
    ],
  };

  $: playlist =
    isDay === 1
      ? [...dayPlaylist['clear']]
      : ([...nightPlaylist['clear']] satisfies VideoStuff);

  let currentVideo = 0;
  const fadeDuration = 3; // Cross-fade duration in seconds
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Function to switch to the next video
  function switchVideo(nextIndex: number) {
    // Clear any existing timeouts to prevent memory leaks and multiple triggers
    timeouts.forEach(clearTimeout);
    timeouts = [];

    currentVideo = nextIndex;
    prepareVideo(currentVideo);
  }

  // Prepare video for playback and setup timing for cross-fade
  function prepareVideo(index: number) {
    const videoElement: HTMLVideoElement | null = document.querySelector(
      `#video${index}`
    );
    if (videoElement !== null) {
      videoElement.play().then(() => {
        const duration = videoElement.duration;
        const fadeOutTimeout = setTimeout(
          () => {
            videoElement.style.opacity = '0';
          },
          (duration - fadeDuration) * 1000
        );

        const switchTimeout = setTimeout(() => {
          switchVideo((index + 1) % playlist.length);
        }, duration * 1000);

        // Store timeouts to clear later if needed
        timeouts.push(fadeOutTimeout, switchTimeout);
      });
    }
  }

  onMount(() => {
    prepareVideo(0);
  });
</script>

{#key weather}
  {#each playlist as video, index}
    <div class="bg-grey absolute inset-0">
      <video
        playsinline
        src={`/video/${isDay === 1 ? 'day' : 'night'}/clear/${video.file}`}
        key={video.file}
        autoplay
        loop
        muted
        type="video/mp4"
        class="player relative bottom-0 h-full w-full object-cover opacity-75"
        class:visible={index === currentVideo}
        id={`video${index}`}
      ></video>
    </div>
  {/each}
{/key}
