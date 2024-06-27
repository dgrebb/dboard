<script lang="ts">
  type Props = {
    total: number;
    current: number;
  };

  let { total, current }: Props = $props();
  let percent: number = 50; //$derived(Math.round(100 - (current / total) * 100));
</script>

<div class="track-progress w-full">
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
  <button class={`playhead absolute right-[] h-3 w-3 rounded-full bg-blue-700`}
    >o</button
  >
  <label for="progress"></label>
</div>
