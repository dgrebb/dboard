<script lang="ts">
  '@hmr:keep-all';
  import { type Settings, type WidgetSettings } from '$types';
  import { isTypeOfWidget, isWidgetSettings } from '$guards';
  import rawSettings from '$root/.config/settings.json';
  import NightScout from '$widgets/NightScout/NightScout.svelte';
  import NowPlaying from '$widgets/NowPlaying/NowPlaying.svelte';
  import NextToArrive from '$widgets/Septa/NextToArrive/NextToArrive.svelte';
  import { onMount, tick, type Component } from 'svelte';
  import Board from './(layouts)/Board.svelte';
  import Schedule from '$widgets/Schedule/Schedule.svelte';

  let mounted = $state(false);

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
  let loadedWidgets: WidgetSettings[] = $state([]);

  onMount(async () => {
    for (const widget of widgets) {
      if (!components[widget.type]) {
        components[widget.type] = (
          await import(`$widgets/${widget.type}/${widget.type}.svelte`)
        ).default;
      }
      loadedWidgets = [...loadedWidgets, widget];
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay between each widget load
    }

    mounted = true;

    await tick();
    // NOTE: Silly animation trick
    document.querySelectorAll('.dboard__grid__item').forEach((el, i) => {
      (el as HTMLElement).style.setProperty('--i', i.toString());
    });
  });
</script>

<svelte:head>
  <title>dboard</title>
</svelte:head>

{#if mounted}
  <Board>
    <NightScout />
    <NowPlaying />
    {#each loadedWidgets as { type, settings }}
      <svelte:component this={components[type]} {settings} />
    {/each}
    <Schedule />
    <NextToArrive />
    <!-- <NewWidget /> -->
  </Board>
{/if}
