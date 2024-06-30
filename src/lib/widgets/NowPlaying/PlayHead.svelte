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
  .track-progress {
    margin: 1rem 0;
    position: relative;
    overflow: hidden;
    height: 1rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    border: thin white solid;
    &::before {
      background-color: white;
      position: absolute;
      z-index: 3;
      height: 100%;
      width: var(--percent);
      content: '';
      transition: width 2s linear;
    }
    &::before,
    .playhead {
      top: 0;
    }
    .playhead {
      transition: left 2s linear;
      position: relative;
      left: var(--percent);
      height: 1rem;
      width: 0.25rem;
      mix-blend-mode: normal;
      /* background-color: white; */
      mix-blend-mode: darken;
      background-color: white;
      &:hover,
      &:focus,
      &:active {
        background-color: black;
        width: 0.75rem;
      }
    }
  }
</style>
