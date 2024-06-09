<script lang="ts">
  import type { ComponentType } from 'svelte';
  import './Backgrounds/backgrounds.css';
  import time from '$lib/stores/time';

  export let component: ComponentType;
</script>

<div
  class="background-component height-full width-full absolute inset-0 flex overflow-hidden"
>
  <svelte:component this={component} />
</div>
