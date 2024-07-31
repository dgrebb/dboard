<script lang="ts">
  import type { ScheduleSettingsType } from '$types';
  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';

  /**
   * Type definition for the component props.
   */
  type Props = {
    /**
     * The schedule settings for the calendars.
     */
    settings: ScheduleSettingsType;
  };

  /**
   * The properties for the component.
   */
  let { settings = $bindable() }: Props = $props();

  /**
   * Array indicating whether the schedule editing is disabled for each calendar.
   * Each element corresponds to a calendar in the `settings.calendars` array.
   */
  let schedulesDisabled = $state(settings.calendars.map(() => true));
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
    <details>
      <summary class="setting-row">Schedule</summary>
      <div class="setting-row setting-row--collapsed">
        <label for="{id}-on">On</label>
        {#if settings.calendars[i].scheduledDisplay}
          <input
            type="time"
            id="{id}-on"
            bind:value={settings.calendars[i].scheduledDisplay.on}
            disabled={schedulesDisabled[i]}
          />
          <label for="{id}-off">Off</label>
          <input
            type="time"
            id="{id}-off"
            bind:value={settings.calendars[i].scheduledDisplay.off}
            disabled={schedulesDisabled[i]}
          />
          <button
            class="settings-edit"
            class:saved={!schedulesDisabled[i]}
            onclick={() => {
              schedulesDisabled[i] = !schedulesDisabled[i];
            }}
          >
            {#if schedulesDisabled[i]}
              <Icon icon="fluent:edit-12-filled" />
            {:else}
              <Icon icon="fluent:checkmark-circle-12-regular" />
            {/if}
          </button>
        {/if}
      </div>
    </details>
  {/each}
</div>
