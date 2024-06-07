<script lang="ts">
  import settings from '$root/.config/settings.json';
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '$root/.config/GLOBALS';
  import Main from '../(layouts)/Main.svelte';
  import { onMount } from 'svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import CurrentWeather from '$components/v2/widgets/CurrentWeather/CurrentWeather.svelte';
  import Nightscout from '$components/v2/widgets/Nightscout/Nightscout.svelte';
  import CurrentMusic from '$components/v2/widgets/CurrentMusic/CurrentMusic.svelte';
  import updateBackgroundColorGradient from '$lib/layout/background';
  import time from '$lib/stores/time';
  import solar from '$lib/stores/solar';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';

  import { conduct } from '../runes/maestro.svelte';
  import NewWidget from '$root/lib/components/v2/widgets/Composer/NewWidget.svelte';
  import type { Widget } from '$root/.config/settings';
  let mounted = $state(false);
  let refreshInterval = DEFAULT_TEMPO;
  let seconds = $state(0);
  let schedule = $state();

  let items = $state();
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

  let widgets: Widget[] = settings.widgets;
  let components: { [key: string]: any } = {};

  onMount(async () => {
    // await conduct(LATITUDE, LONGITUDE);

    nightscoutData();
    // fetchWeatherData();
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
    fetchSeptaNextToArrive();
    setInterval(async () => {
      nightscoutData();
      // fetchWeatherData();
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
          await import(
            `$components/v2/widgets/${widget.type}/${widget.type}.svelte`
          )
        ).default;
      }
    }
    mounted = true;
  });
</script>

<svelte:head>
  <link rel="icon" href="/favicon2.ico" />
</svelte:head>

{#if mounted}
  <Main>
    <div class="dboard__grid" use:pullToRefresh>
      {#each items as { title, content: { small: { value: label, direction }, large: { value: mainDisplayValue } }, series: data }}
        {#if direction}
          <Nightscout {data} {label} {mainDisplayValue} {direction} />
        {/if}
      {/each}
      {#if widgets}
        {#each widgets as { type, settings }}
          <svelte:component this={components[type]} {settings} />
        {/each}
      {/if}
      <!-- <CurrentMusic /> -->
      <NewWidget />
    </div>

    <div class="dboard__grid">
      <!-- <SeptaNextToArrive {schedule} /> -->
      <div class="dboard__grid__item control-widget">
        <div class="dboard__card">
          <h1
            class="flex h-full flex-col items-center justify-center text-9xl text-orange-500"
          >
            {seconds}
          </h1>
          <!-- <OnOff /> -->
          <!-- <Restart /> -->
        </div>
      </div>
    </div>

    <div slot="countdown-bar">
      <ProgressBar {refreshInterval} {seconds} />
    </div>
  </Main>
{/if}
