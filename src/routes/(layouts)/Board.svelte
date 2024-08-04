<script lang="ts">
  import NewWidget from '@components/Composer/NewWidget.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="dboard__grid">
  {#if children}
    {@render children()}
  {:else}
    <NewWidget />
  {/if}
</div>
