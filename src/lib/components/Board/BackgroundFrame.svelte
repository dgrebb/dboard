<script lang="ts">
  import type { Component } from 'svelte';
  import './Backgrounds/backgrounds.css';

  export let BackgroundComponent: Component;
</script>

<div
  class="background-component height-full width-full absolute inset-0 flex overflow-hidden"
>
  <BackgroundComponent />
</div>
