<script lang="ts">
  export let seconds: number;
  export let refreshInterval: number;
  $: progress = seconds > 2 ? ((seconds * 1000) / refreshInterval) * 50 : 0;
</script>

<!-- <div
  class="progress-bar absolute bottom-0 bg-gray-950 transition-[width] dark:bg-gray-300"
  style="transform: scale3d({progress /
    100}, 1, 1); opacity: {progress}%; will-change: transform, opacity;"
></div> -->

<style>
  .progress-bar {
    width: 1%;
    transition-property: width;
    transition-duration: 2000ms;
    height: 3px;
  }
</style>
