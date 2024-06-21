<script lang="ts">
  import time from '$lib/stores/time';
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import settings from '$root/.config/settings.json';
  import updateBackgroundColorGradient from '$root/lib/layout/background';
  import SeptaNextToArrive from '$widgets/Septa/NextToArrive/NextToArrive.svelte';
  import NightScout from '$widgets/NightScout/NightScout.svelte';
  import NowPlaying from '$widgets/NowPlaying/NowPlaying.svelte';
  import { onMount } from 'svelte';
  import Board from './(layouts)/Board.svelte';
  import { isSteptaNextToArriveDataArray } from '$root/lib/types';
  let mounted = $state(false);
  let refreshInterval = DEFAULT_TEMPO;
  let schedule: SeptaNextToArrive[] | boolean = $state(false);

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
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    fetchSeptaNextToArrive();
    setInterval(async () => {
      fetchSeptaNextToArrive();
      updateBackgroundColorGradient(LATITUDE, LONGITUDE);
      // seconds = 0;
    }, refreshInterval);

    setInterval(() => {
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

{#if mounted}
  <Board>
    <NightScout />
    {#if widgets}
      {#each widgets as { type, settings }}
        <svelte:component this={components[type]} {settings} />
      {/each}
    {/if}
    <!-- <NewWidget /> -->
    <NowPlaying />
  </Board>

  <Board>
    {#if typeof schedule !== 'boolean' && isSteptaNextToArriveDataArray(schedule)}
      <SeptaNextToArrive {schedule} />
    {/if}
  </Board>
{/if}
