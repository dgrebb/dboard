<script lang="ts">
  import { createNightScoutWidget } from '$lib/stores/nightscout.svelte';
  import { generateID, toCamelCase } from '$root/lib/_helpers/strings';
  import { TypeOfWidget, type NightScoutData } from '$root/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { fade, blur } from 'svelte/transition';
  import NightscoutGraph from '$root/lib/widgets/NightScout/NightscoutGraph.svelte';
  import Icon from '@iconify/svelte';

  let label = 'mg/dL';
  const name = 'NightScout';
  const id = generateID(name);
  const path = toCamelCase(name);
  const upstreamAPIURL =
    'https://glu.7ub3s.net/api/v1/entries.json?count=5&token=${secrets.SECRET_NIGHTSCOUT_TOKEN}';
  const refreshInterval = 60000;
  const resubscribeInterval = 3600000; // Resubscribe every hour
  let resubscribeTimeout: NodeJS.Timeout;
  let retryTimeout: NodeJS.Timeout;
  let retryCount = 0;
  const nightScoutWidget = createNightScoutWidget(
    TypeOfWidget.NightScout,
    name,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let loaded = $state(false);
  let series = $state([0]);
  let currentValue: number = $state(0);
  let lastValue: number = $state(0);
  let colors: { mainColor: string; backgroundColor: string } = $state({
    mainColor: 'darkgreen',
    backgroundColor: 'green',
  });

  // TODO: refactor with getters
  const maxMeasurable = 400;
  let directionIcon = $state('iconamoon:cloud-download-light');
  let difference: number = $state(0);
  let change: number | string = $state(0);
  let direction: string = $state('Flat');

  let eventSource: EventSource | null = null;

  async function startSubscription() {
    if (eventSource) {
      eventSource.close();
    }

    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    eventSource = new EventSource(
      `/api/stream/${path}?name=${name}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      nightScoutWidget.setData(data);
      retryCount = 0; // Reset retry count on successful message
    };

    eventSource.onerror = (error) => {
      console.log('EventSource error:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = setTimeout(() => {
        startSubscription();
      }, retryDelay);
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = setInterval(() => {
      startSubscription();
    }, resubscribeInterval);
  }

  onMount(async () => {
    await startSubscription();
    loaded = true;
    window.addEventListener('beforeunload', handleWindowUnload);
  });

  function handleWindowUnload() {
    console.log('Handling window unload...');
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  }

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  });

  $effect(() => {
    series = nightScoutWidget.getSeries();
    currentValue = nightScoutWidget.getCurrent();
    lastValue = nightScoutWidget.getLast();
    colors = nightScoutWidget.getColors(currentValue);

    // TODO: Refactor with $rune getters
    const SSEData: NightScoutData = $state.snapshot(nightScoutWidget.getData);
    if (Array.isArray(SSEData) && SSEData.length) {
      difference = currentValue - lastValue;
      change = difference > 0 ? `+${difference}` : difference;
      direction = SSEData[0].direction;
      directionIcon = getDirectionIcon(direction);
      // nightScoutWidget.getGraphSettings(currentValue, maxMeasurable);
    }
  });

  function getDirectionIcon(direction: string): string {
    switch (direction) {
      case 'Up':
        return 'ph:trend-up-light';
      case 'FortyFiveUp':
        return 'ph:arrow-bend-right-up-light';
      case 'Flat':
        return 'material-symbols-light:trending-flat';
      case 'Down':
        return 'ph:trend-down-light';
      case 'FortyFiveDown':
        return 'ph:arrow-bend-right-down-light';
      default:
        return 'iconamoon:cloud-error-light';
    }
  }
</script>

<div
  class="dboard__grid__item relative transition-colors"
  style={`--mainColor: ${colors.mainColor}`}
>
  {#if currentValue}
    <div
      class="dboard__card glu relative border-none bg-opacity-10"
      style={`background-color: var(--skyBaseColor)`}
      transition:fade
    >
      <h2
        class="flex items-center text-[var(--mainColor)] brightness-50 dark:brightness-150"
      >
        {label}
      </h2>
      <h2 class="text-[var(--mainColor)]">
        {change}
        <Icon
          icon={directionIcon}
          height="32px"
          color={colors.mainColor}
          class="inline-flex align-middle brightness-50 dark:brightness-150"
        />
      </h2>

      <NightscoutGraph
        {series}
        mainColor={colors.mainColor}
        backgroundColor={colors.backgroundColor}
      />
      {#key currentValue}
        <h1
          class="dboard__card--value-lg bg-value z-10 mt-auto justify-end text-9xl tracking-tight brightness-50 dark:brightness-200"
          transition:blur
        >
          {currentValue}
        </h1>
      {/key}
    </div>
  {/if}
</div>

<style lang="postcss">
  .bg-value {
    color: var(--mainColor);
    transition: color 30s ease-in;
  }
</style>
