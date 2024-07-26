<script lang="ts">
  import type { ScheduleSettingsType } from '$types';
  import { fade } from 'svelte/transition';

  type Props = {
    settings: ScheduleSettingsType;
  };

  let { settings = $bindable() }: Props = $props();
</script>

<div class="dboard__card dboard__card--settings" transition:fade>
  <h3 class="setting">Visible Calendars</h3>
  {#each settings.calendars as { id }, i}
    <div class="setting-row">
      <input
        class="setting-toggle"
        type="checkbox"
        name="{id}-display"
        id="{id}-display"
        bind:checked={settings.calendars[i].display}
      />
      <label class="setting-toggle-label" for="{id}-display">{id}</label>
    </div>
  {/each}
</div>
