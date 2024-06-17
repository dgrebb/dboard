<script lang="ts">
  import settings from '$root/.config/settings.json';
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import Board from './(layouts)/Board.svelte';
  import { onMount } from 'svelte';
  import time from '$lib/stores/time';
  import CurrentMusic from '$components/widgets/CurrentMusic/CurrentMusic.svelte';
  import type { DBoardItem } from '$root/lib/types';
  import updateBackgroundColorGradient from '$root/lib/layout/background';
  import NewWidget from '$components/Composer/NewWidget.svelte';
  import NightScout from '$widgets/NightScout/NightScout.svelte';
  import NowPlaying from '$widgets/NowPlaying/NowPlaying.svelte';
  let mounted = $state(false);
  let refreshInterval = DEFAULT_TEMPO;
  let seconds = $state(0);
  let schedule = $state();

  let items: DBoardItem[] | undefined = $state();
  const nightscoutData = async () => {
    const res = await fetch('/api/v1/nightscout');
    const data = await res.json();
    const { nightscout } = data;
    items = nightscout.items;
  };

  const fetchSeptaNextToArrive = async () => {
    const data = await fetch('/api/v1/septa', { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => console.error(err));
    schedule = data.schedule;
    // console.log('🚀 ~ fetchSeptaNextToArrive ~ schedule:', schedule);
  };

  let widgets = settings.widgets;
  let components: { [key: string]: any } = {};

  onMount(async () => {
    nightscoutData();
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    fetchSeptaNextToArrive();
    setInterval(async () => {
      nightscoutData();
      fetchSeptaNextToArrive();
      updateBackgroundColorGradient(LATITUDE, LONGITUDE);
      seconds = 0;
    }, refreshInterval);

    setInterval(() => {
      seconds++;
      let now = new Date();
      $time = now.getHours() * 60 + now.getMinutes();
    }, 1000);

    for (const widget of widgets) {
      if (!components[widget.type]) {
        components[widget.type] = (
          await import(`$widgets/${widget.type}/${widget.type}.svelte`)
        ).default;
      }
    }
    mounted = true;
  });
</script>

<svelte:head>
  <link rel="icon" href="/favicon2.ico" />
</svelte:head>

{#if mounted && items}
  <Board>
    <NightScout />
    {#if widgets}
      {#each widgets as { type, settings }}
        <svelte:component this={components[type]} {settings} />
      {/each}
    {/if}
    <!-- <NowPlaying /> -->
    <NewWidget />
    <CurrentMusic {items} />
  </Board>

  <Board>
    <div class="dboard__grid__item control-widget relative">
      <div class="dboard__card">
        <h1
          class="flex h-full flex-col items-center justify-center text-9xl text-orange-500"
        >
          {seconds}
        </h1>
      </div>
    </div>
  </Board>
{/if}
