<script lang="ts">
  import { WidgetType, createWidget } from '$lib/stores';
  import { generateID, toCamelCase } from '$root/lib/_helpers/strings';
  import type { ChartSeriesGlucose, NightScoutData } from '$root/lib/types';
  import { onMount } from 'svelte';
  const name = 'NightScout';
  const id = generateID(name);
  const path = toCamelCase(name);
  const upstreamAPIURL =
    'https://glu.7ub3s.net/api/v1/entries.json?count=5&token=${secrets.SECRET_NIGHTSCOUT_TOKEN}';
  const refreshInterval = 60000;
  const nightScoutWidget = createWidget(
    WidgetType.NightScout,
    name,
    id,
    path,
    upstreamAPIURL,
    refreshInterval
  );

  let currentValue: string | number = $state('⬇');

  async function subscribe(endpoint: string) {
    const encodedUpstreamAPIURL = encodeURIComponent(upstreamAPIURL);
    const response = await fetch(
      `/api/stream/${endpoint}?name=${name}&id=${id}&path=${path}&refreshInterval=${refreshInterval}&upstreamAPIURL=${encodedUpstreamAPIURL}`
    );

    if (!response.body) {
      console.error('No response body');
      return;
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    try {
      while (true) {
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

    while (true && reader) {
      const { value, done } = await reader.read();
      const data = value ? JSON.parse(value) : false;
      nightScoutWidget.setData(data);
      if (done) {
        console.log('Stream complete');
        reader.cancel();
        nightScoutWidget.setData(data);
        return;
      }
    }
  }

  onMount(async function () {
    await subscribe(path);
  });

  $effect(() => {
    const data: NightScoutData = $state.snapshot(nightScoutWidget.getData);
    // console.log('also received an effect after updating data', data);
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
