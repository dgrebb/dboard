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
  <button class={`playhead absolute h-3 w-3 rounded-full bg-blue-700`}></button>
</div>

<style lang="postcss">
  .track-progress {
    margin: 1rem 0;
    position: relative;
    height: 0.25rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: white;
    mix-blend-mode: difference;
    .playhead {
      transition: left 2s linear;
      position: relative;
      left: var(--percent);
    }
  }
</style>
