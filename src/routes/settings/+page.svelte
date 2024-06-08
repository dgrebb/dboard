<script lang="ts">
  import type { StreamsType } from '$lib/types';
  import { streams } from '$root/lib/stores/streams.svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  let streamList: StreamsType = $state(streams.getAll);
  let newStreamTitle = $state('');
  let result: string = $state('');

  // console.log(streams);

  async function subscribe() {
    const response = await fetch('/api/stream/sse');
    const reader = response.body
      ? response.body.pipeThrough(new TextDecoderStream()).getReader()
      : false;
    while (true && reader) {
      const { value, done } = await reader.read();
      if (done) break;
      result = value;
    }
  }

  onMount(subscribe);
</script>

<h1>Streams</h1>
{#each streamList as { title }}
  <h2>{title}</h2>
{/each}
<input type="text" placeholder="Stream Name" bind:value={newStreamTitle} />
<Button onclick={() => streams.addStream({ title: newStreamTitle })}
  >Add Stream</Button
>

<h1>Events</h1>
{#if result}
  <pre>{result}</pre>
{/if}

<style>
  /* your styles go here */
</style>
