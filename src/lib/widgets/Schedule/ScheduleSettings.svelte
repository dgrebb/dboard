<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import type { ScheduleSettingsType } from '@types';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import { Toggle } from '$lib/components/ui/toggle/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  /**
   * Type definition for the component props.
   */
  interface Props {
    /**
     * The schedule settings for the calendars.
     */
    settings: ScheduleSettingsType;
  }

  /**
   * The properties for the component.
   */
  let { settings = $bindable() }: Props = $props();

  /**
   * Array indicating whether the schedule editing is disabled for each calendar.
   * Each element corresponds to a calendar in the `settings.calendars` array.
   */
  let schedulesDisabled = $state(settings.calendars.map(() => true));
  let showSchedule = $state(settings.calendars.map(() => false));
</script>

<div class="dboard__card dboard__card--settings" transition:fade>
  <Table.Root class="settings-table">
    <Table.Caption>Calendar Settings</Table.Caption>
    <Table.Body>
      {#each settings.calendars as { id }, i}
        <Table.Row class="setting-row">
          <Table.Cell>
            <Label for="{id}-display">{id}</Label>
          </Table.Cell>
          <Table.Cell class="text-right">
            <Switch
              name="{id}-display"
              id="{id}-display"
              bind:checked={settings.calendars[i].display}
            />
          </Table.Cell>
          <Table.Cell class="text-right"
            ><Icon
              icon="fluent:clock-24-regular"
              onclick={() => (showSchedule[i] = !showSchedule[i])}
            /></Table.Cell
          >
        </Table.Row>
        {#if showSchedule[i]}
          <Table.Row
            class={`setting-row ${showSchedule[i] ? 'setting-row--collapsed' : null}`}
          >
            <Table.Cell>
              <Label for="{id}-on">On</Label>
              <Input
                type="time"
                id="{id}-on"
                bind:value={settings.calendars[i].scheduledDisplay.on}
                disabled={schedulesDisabled[i]}
              />
            </Table.Cell>
            <Table.Cell>
              <Label for="{id}-off">Off</Label>
              <Input
                type="time"
                id="{id}-off"
                bind:value={settings.calendars[i].scheduledDisplay.off}
                disabled={schedulesDisabled[i]}
              />
            </Table.Cell>
            <Table.Cell>
              <Toggle
                aria-label="Toggle edit mode"
                variant="outline"
                onclick={() => {
                  schedulesDisabled[i] = !schedulesDisabled[i];
                }}
                >{#if schedulesDisabled[i]}<Icon
                    icon="fluent:edit-12-filled"
                    class="h-4 w-4"
                  />
                {:else}
                  <Icon
                    icon="fluent:checkmark-circle-12-regular"
                    class="h-4 w-4"
                  />
                {/if}
              </Toggle>
            </Table.Cell>
          </Table.Row>
        {/if}
      {/each}
    </Table.Body>
  </Table.Root>
</div>
