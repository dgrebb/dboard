<script lang="ts">
  '@hmr:keep-all';
  import {
    isTypeOfWidget,
    isWidgetSettings,
    type Settings,
    type WidgetSettings,
  } from '$lib/types';
  import rawSettings from '$root/.config/settings.json';
  import NightScout from '$widgets/NightScout/NightScout.svelte';
  import NowPlaying from '$widgets/NowPlaying/NowPlaying.svelte';
  import NextToArrive from '$widgets/Septa/NextToArrive/NextToArrive.svelte';
  import { onMount, type Component } from 'svelte';
  import Board from './(layouts)/Board.svelte';
  let mounted = $state(false);

  // NOTE: Mocks
  // import mockSepta from '$root/__fixtures__/septa/nextToArrive.json';

  const parseWidget = (widget: unknown): WidgetSettings | null => {
    if (isWidgetSettings(widget) && isTypeOfWidget(widget.type)) {
      return {
        ...widget,
        type: widget.type,
      };
    }
    return null;
  };

  const parseSettings = (rawSettings: unknown): Settings => {
    const raw = rawSettings as {
      widgets: unknown[];
      otherLocations: unknown[];
    };
    return {
      widgets: raw.widgets
        .map(parseWidget)
        .filter((widget): widget is WidgetSettings => widget !== null),
      otherLocations: raw.otherLocations
        .map(parseWidget)
        .filter((widget): widget is WidgetSettings => widget !== null),
    };
  };

  const settings: Settings = parseSettings(rawSettings);

  let widgets: WidgetSettings[] = settings.widgets;
  // let otherLocations: WidgetSettings[] = settings.otherLocations;

  let components: Record<string, Component> = {};

  onMount(async () => {
    for (const widget of widgets) {
      if (!components[widget.type]) {
        components[widget.type] = (
          await import(`$widgets/${widget.type}/${widget.type}.svelte`)
        ).default;
      }
    }
    mounted = true;
  });

  import { source } from 'sveltekit-sse';
  const svelteSSEValue = $state(
    source('/api/stream/weather').select('message')
  );

  $effect(() => {
    // svelteSSEValue
    console.log('🚀 ~ $effect ~ svelteSSEValue:', $svelteSSEValue);
  });
</script>

<svelte:head>
  <title>dboard</title>
</svelte:head>

{#if mounted}
  <Board>
    <NightScout />
    <h1 class="text-orange-400">{$svelteSSEValue}</h1>
    <h1 class="text-orange-400">{$svelteSSEValue}</h1>
    <h1 class="text-orange-400">{$svelteSSEValue}</h1>
    <h1 class="text-orange-400">{$svelteSSEValue}</h1>
    <h1 class="text-orange-400">{$svelteSSEValue}</h1>
    <NowPlaying />
    <NextToArrive />
    {#if widgets}
      {#each widgets as { type, settings }}
        <svelte:component this={components[type]} {settings} />
      {/each}
    {/if}
    <!-- <NewWidget /> -->
  </Board>
{/if}
