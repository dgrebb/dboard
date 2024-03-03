<script lang="ts">
  export let seconds: number;
  export let refreshInterval: number;
  $: progress = seconds > 2 ? ((seconds * 1000) / refreshInterval) * 100 : 0;
</script>

<div
  class="progress-bar bg-gray-950 transition-[width] dark:bg-gray-50"
  style="width: {progress}%"
></div>

<style>
  .progress-bar {
    transition-property: width;
    transition-duration: 2000ms;
    height: 0.25rem;
  }
</style>
