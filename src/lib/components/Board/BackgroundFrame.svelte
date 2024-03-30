<script lang="ts">
  import type { ComponentType } from 'svelte';
  import './Backgrounds/styles.css';
  import { time } from '$lib/store';

  export let component: ComponentType;
</script>

<div
  class="background-component height-full width-full absolute inset-0 flex overflow-hidden"
>
  {#if $time < 1400}
    <svelte:component this={component} />
  {:else if $time < 1420}
    <p>it's daytime</p>
  {/if}
</div>
