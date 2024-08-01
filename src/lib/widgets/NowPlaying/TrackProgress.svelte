<script lang="ts">
  import { selfOffsetBackground } from '@actions/selfOffsetBackground';
  import { formatSecondsToMinutes } from '@utils/strings';

  type Props = {
    total: number;
    current: number;
    showHud: boolean;
  };

  let { total, current, showHud }: Props = $props();
  let percent: number = $derived(Math.round(100 - (current / total) * 100));
  let progress: string = formatSecondsToMinutes(total - current);
  let remaining: string = formatSecondsToMinutes(current);
</script>

<div class="track-progress">
  <p class="track-time-now" use:selfOffsetBackground class:showHud>
    {progress}
  </p>
  <p class="track-time-remaining" use:selfOffsetBackground class:showHud>
    -{remaining}
  </p>

  <div class="track-progress-bar" style={`--percent: ${percent}%;`}>
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
</div>

<style lang="postcss">
  .playhead {
    left: var(--percent);
  }
</style>
