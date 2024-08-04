<script lang="ts">
  import type { StreamsType } from '@types';
  // import { generateID } from '@utils/strings';
  import { streams } from '@stores/streams.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  let streamList: StreamsType = $state(streams.getAll);
  let newStreamName = $state('');
  let result: Record<string, string> = $state({});
  let newStreamPath: string = $state('');
  let newStreamInterval: number = $state(900000);
  let newStreamAPIURL: string = $state('');

  async function subscribe(endpoint: string) {
    const response = await fetch(`/api/stream/${endpoint}`);
    const reader = response.body
      ? response.body.pipeThrough(new TextDecoderStream()).getReader()
      : false;
    // eslint-disable-next-line no-constant-binary-expression
    while (true && reader) {
      const { value, done } = await reader.read();
      if (done) break;
      console.info('reading stream', `${endpoint}: ${value}`);
      result = {
        ...result,
        [endpoint]: value,
      };
    }
  }

  $effect(() => {
    (async () => {
      if (newStreamPath) {
        await subscribe(newStreamPath);
      }
    })();
  });

  async function handleAddStream() {
    newStreamPath = await streams.addStream({
      name: newStreamName,
      refreshInterval: newStreamInterval * 60,
      upstreamAPIURL: newStreamAPIURL,
    });
  }

  onMount(async function () {
    await subscribe('streamOne');
  });
</script>

<h1>Streams</h1>
{#each streamList as { name, id, path }}
  <h2>{name}</h2>
  <h3>{id}</h3>
  <h3>{path}</h3>
  <h1>Events</h1>
  {#if result[path]}
    <pre>{result[path]}</pre>
  {/if}
{/each}
<input type="text" placeholder="Stream Name" bind:value={newStreamName} />
<input
  type="number"
  min="5000"
  placeholder="Refresh Interval"
  bind:value={newStreamInterval}
/>
<Button onclick={handleAddStream}>Add Stream</Button>

<style>
  /* your styles go here */
</style>
