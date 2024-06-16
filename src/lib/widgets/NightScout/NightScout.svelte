<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade, blur } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import { TypeOfWidget } from '$root/lib/types';
  import { generateID, toCamelCase } from '$root/lib/_helpers/strings';
  import { createNightScoutWidget } from './nightScoutStore.svelte';
  import NightscoutGraph from '$widgets/NightScout/NightScoutGraph.svelte';

  let loaded = $state(false);
  let label = 'mg/dL';
  const name = 'NightScout';
  const id = generateID(name);
  const path = toCamelCase(name);
  const upstreamAPIURL =
    'https://glu.7ub3s.net/api/v1/entries.json?count=36&token=${secrets.SECRET_NIGHTSCOUT_TOKEN}';
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

  const maxMeasurable = 400;
  let series = $state([0]);
  let currentValue: number = $state(0);
  let difference: string | number = $state(0);
  let colors: { mainColor: string; backgroundColor: string } = $state({
    mainColor: 'darkgreen',
    backgroundColor: 'green',
  });
  let directionIcon = $state('iconamoon:cloud-download-light');
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
    series = nightScoutWidget.getChronologicalSeries();
    currentValue = nightScoutWidget.getCurrent();
    difference = nightScoutWidget.getDifference();
    colors = nightScoutWidget.getColors(currentValue);
    directionIcon = nightScoutWidget.getDirectionIcon();
  });
</script>

<div
  class="dboard__grid__item relative"
  class:shaking={currentValue < 75}
  style={`--mainColor: ${colors.mainColor}`}
>
  {#if currentValue}
    <div
      class="dboard__card glu relative border-none bg-opacity-10 transition-colors"
      transition:fade
    >
      <h2 class="flex items-center text-[var(--mainColor)] dark:brightness-150">
        {label}
      </h2>
      <h2 class="text-[var(--mainColor)]">
        {difference}
        <Icon
          icon={directionIcon}
          height="32px"
          color={colors.mainColor}
          class="inline-flex align-middle dark:brightness-150"
        />
      </h2>

      {#if currentValue < 80}
        <div class="warning">
          <Icon
            icon="fluent:warning-24-regular"
            height="96px"
            class="inline-flex align-middle dark:brightness-150"
          />
        </div>
      {/if}

      <NightscoutGraph
        {maxMeasurable}
        {series}
        mainColor={colors.mainColor}
        backgroundColor={colors.backgroundColor}
      />
      {#key currentValue}
        <h1
          class="dboard__card--value-lg bg-value z-10 mt-auto justify-end text-9xl tracking-tight dark:brightness-200"
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
    mix-blend-mode: lighten;
    transition: color 3s ease-in;
  }
  .warning {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    align-self: flex-end;
    color: #ffffa8;
    opacity: 0;
    animation: fadeInOut 2s infinite;
  }

  .shaking {
    animation: horizontal-shaking 0.15s infinite;
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes horizontal-shaking {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(5px);
    }
    50% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
