<script lang="ts">
  import type { ScheduleSettingsType } from '$types';
  import { fade } from 'svelte/transition';

  type Props = {
    settings: ScheduleSettingsType;
  };

  let { settings = $bindable() }: Props = $props();
</script>

<div class="dboard__card dboard__card--settings" transition:fade>
  <h3 class="setting">Display</h3>
  {#each settings.calendars as { id, display }, i}
    {#if display === true}
      <h4>{id}</h4>
      <input
        type="checkbox"
        name="{id}-display"
        id="{id}-display"
        bind:checked={settings.calendars[i].display}
      />
      <label for="{id}-display">Display this calendar?</label>
    {/if}
  {/each}
</div>
