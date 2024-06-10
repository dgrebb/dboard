<script lang="ts">
  import { createWidget } from '$lib/stores';
  import { generateID, toCamelCase } from '$root/lib/_helpers/strings';
  import { TypeOfWidget, type NightScoutData } from '$root/lib/types';
  import { onDestroy, onMount } from 'svelte';

  const name = 'NightScout';
  const id = generateID(name);
  const path = toCamelCase(name);
  const upstreamAPIURL =
    'https://glu.7ub3s.net/api/v1/entries.json?count=5&token=${secrets.SECRET_NIGHTSCOUT_TOKEN}';
  const refreshInterval = 60000;
  const nightScoutWidget = createWidget(
    TypeOfWidget.NightScout,
    name,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let currentValue: string | number = $state('⬇');

  let reader: ReadableStreamDefaultReader<string> | null = null;
  let isReading = $state(true); // Flag to manage reading state
  async function subscribe(endpoint: string) {
    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    const response = await fetch(
      `/api/stream/${endpoint}?name=${name}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    if (!response.body) {
      console.error('No response body');
      return;
    }

    reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    try {
      while (isReading) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log('reading stream', `${endpoint}: ${value}`);
        nightScoutWidget.setData(JSON.parse(value));
      }
    } catch (error) {
      console.error('Stream reading error:', error);
    } finally {
      reader.releaseLock();
    }
  }

  onMount(async function () {
    isReading = true;
    await subscribe(path);
  });

  onDestroy(() => {
    isReading = false;
    if (reader) {
      reader.cancel();
      reader.releaseLock();
      reader = null;
    }
  });

  $effect(() => {
    const data: NightScoutData = $state.snapshot(nightScoutWidget.getData);
    if (data.length) {
      currentValue = data[0].sgv;
    }
  });
</script>

<div class="nightscout">
  <h1>nightscout data streaming</h1>
  <pre class="code">{@html JSON.stringify(nightScoutWidget.getData)}</pre>
  <h2>Current Reading: {currentValue}</h2>
  <textarea name="notes" id="notes">notes</textarea>
</div>

<style>
  .code {
    max-width: 100%;
    text-wrap: wrap;
  }
</style>
