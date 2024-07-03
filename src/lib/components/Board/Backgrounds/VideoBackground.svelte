<script lang="ts">
  import weather from '$lib/stores/weatherLeg';
  import { onMount } from 'svelte';
  let isDay: number, weatherCode;

  type VideoStuff = {
    file: string;
  }[];

  $: ({ is_day: isDay, weatherCode } = $weather);

  const dayPlaylist = {
    clear: [
      {
        file: 'dandelions.mp4',
      },
      {
        file: 'rain-window.mp4',
      },
    ],
  };

  const nightPlaylist = {
    clear: [
      {
        file: 'milky-way-mountains.mp4',
      },
      {
        file: 'stars-1.mp4',
      },
      {
        file: 'tall-starry-island.mp4',
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
  async function switchVideo(nextIndex: number) {
    // Clear any existing timeouts to prevent memory leaks and multiple triggers
    timeouts.forEach(clearTimeout);
    timeouts = [];

    currentVideo = nextIndex;
    prepareVideo(currentVideo);
  }

  // Prepare video for playback and setup timing for cross-fade
  async function prepareVideo(index: number) {
    const videoElement: HTMLVideoElement | null = document.querySelector(
      `#video${index}`
    );
    const nextIndex = index === playlist.length ? 0 : index + 1;
    if (videoElement !== null) {
      videoElement.play().then(() => {
        const duration = videoElement.duration;
        const fadeOutTimeout = setTimeout(
          () => {
            videoElement.style.opacity = '0';
          },
          (duration - fadeDuration) * 1000
        );

        const switchTimeout = setTimeout(async () => {
          await switchVideo(nextIndex % playlist.length);
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

{#key $weather}
  <div class="absolute inset-0 bg-black">
    {#each playlist as video, index}
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
    {/each}
  </div>
{/key}
