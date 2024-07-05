<!-- src/lib/components/SafeHtml.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  export let html: string;

  // Variable to dynamically specify the element type
  let elementType: string = 'div';

  // Creating a dynamic element to hold the inner HTML content
  let container: HTMLElement | null = null;

  onMount(() => {
    if (container) {
      container.innerHTML = html;
    }
  });
</script>

<svelte:element this={elementType} bind:this={container} />
