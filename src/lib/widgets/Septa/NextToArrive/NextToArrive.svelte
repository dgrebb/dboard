<script lang="ts">
  import { TypeOfWidget, type SeptaNextToArriveData } from '$types';
  import { isSeptaNextToArriveDataArray } from '$guards';
  import { createWidget } from '$stores';
  import { generateID, toCamelCase } from '$utils/strings';
  import Icon from '@iconify/svelte';
  import { onDestroy, onMount } from 'svelte';

  const widgetName = 'Septa';
  const id = generateID(widgetName);
  const path = toCamelCase(widgetName);
  const refreshInterval = 900000;
  const resubscribeInterval = 3600000; // Resubscribe every hour
  const upstreamAPIURL = `/api/v2/septa`;

  let resubscribeTimeout: number;
  let retryTimeout: number;
  let retryCount = 0;
  let eventSource: EventSource | null = null;
  const nextToArriveWidget = createWidget(
    TypeOfWidget.NextToArrive,
    widgetName,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let schedule = $state<SeptaNextToArriveData[]>(
    nextToArriveWidget.getData as SeptaNextToArriveData[]
  );

  function setupEventSource() {
    if (eventSource) {
      eventSource.close();
    }

    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    eventSource = new EventSource(
      `/api/stream/${path}?name=${widgetName}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    eventSource.onmessage = (event) => {
      const { schedule } = JSON.parse(event.data);
      nextToArriveWidget.setData(schedule);
      retryCount = 0; // Reset retry count on successful message
    };

    eventSource.onerror = (error) => {
      console.info('EventSource error:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      retryTimeout = window.setTimeout(() => {
        setupEventSource();
      }, retryDelay) as unknown as number;
    };

    // Set up periodic resubscription
    if (resubscribeTimeout) {
      clearInterval(resubscribeTimeout);
    }
    resubscribeTimeout = window.setInterval(() => {
      setupEventSource();
    }, resubscribeInterval);
  }

  function stopEventSource() {
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

  onMount(async () => {
    setupEventSource();
    window.addEventListener('beforeunload', handleWindowUnload);
  });

  function handleWindowUnload() {
    console.info('Handling window unload...');
    stopEventSource();
  }

  $effect(() => {
    schedule = nextToArriveWidget.getData as SeptaNextToArriveData[];
  });

  onDestroy(() => {
    stopEventSource();
    window.removeEventListener('beforeunload', handleWindowUnload);
  });
</script>

<div class="dboard__grid__item">
  {#if isSeptaNextToArriveDataArray(schedule) && schedule.length > 0}
    <div class="dboard__card">
      <Icon
        icon="mynaui:train"
        height={88}
        color="red"
        class="absolute bottom-4 right-4 opacity-30"
      />
      <table class="septa">
        <tbody>
          {#each schedule as train}
            <tr class="septa__train">
              <td>{train.orig_departure_time}</td>
              <td class="delay">
                {train.orig_delay}
              </td>
              <td class="arrive">
                {train.orig_arrival_time}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .septa {
    width: 100%;
    tr {
      td {
        &.delay {
          flex-grow: 1;
          text-align: center;
        }
        &.arrive {
          text-align: right;
        }
      }
    }
  }
</style>
