<script lang="ts">
  '@hmr:keep-all';
  import updateBackgroundColorGradient from '$lib/layout/background';
  import legTime from '$lib/stores/legTime';
  import {
    isSteptaNextToArriveDataArray,
    type WidgetSettings,
  } from '$lib/types';
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import settings from '$root/.config/settings.json';
  import NightScout from '$widgets/NightScout/NightScout.svelte';
  import NowPlaying from '$widgets/NowPlaying/NowPlaying.svelte';
  import SeptaNextToArrive from '$widgets/Septa/NextToArrive/NextToArrive.svelte';
  import { onMount, type Component } from 'svelte';
  import Board from './(layouts)/Board.svelte';
  let mounted = $state(false);
  let refreshInterval = DEFAULT_TEMPO;
  let schedule: SeptaNextToArrive[] | boolean = $state(false);

  const fetchSeptaNextToArrive = async () => {
    const data = await fetch('/api/v1/septa', { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => console.error(err));
    schedule = data.schedule;
  };

  let widgets: WidgetSettings[] = settings.widgets;
  let components: Record<string, Component> = {};

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
      $legTime = now.getHours() * 60 + now.getMinutes();
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
  <title>dboard</title>
</svelte:head>

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
    {#if typeof schedule !== 'boolean' && isSteptaNextToArriveDataArray(schedule) && schedule.length > 0}
      <SeptaNextToArrive {schedule} />
    {/if}
  </Board>
{/if}
