<script lang="ts">
  import App from './(layouts)/App.svelte';
  import '$lib/styles/global.pcss';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<App>
  {#if children}
    {@render children()}
  {/if}
</App>
