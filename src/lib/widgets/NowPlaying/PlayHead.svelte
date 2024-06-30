<script lang="ts">
  type Props = {
    total: number;
    current: number;
  };

  let { total, current }: Props = $props();
  let percent: number = $derived(Math.round(100 - (current / total) * 100));
</script>

<div class="track-progress" style={`--percent: ${percent}%;`}>
  <!-- <input
    type="range"
    id="progress"
    name="progress"
    min="0"
    max="1000"
    step=".1"
    value={percent}
  /> -->
  <!-- ${percent}% -->
  <button class={`playhead`}></button>
</div>

<style lang="postcss">
  .playhead {
    left: var(--percent);
  }
</style>
