<script lang="ts">
  import type { SeptaDataNextToArrive } from '$lib/types';
  import Icon from '@iconify/svelte';
  export let schedule: SeptaDataNextToArrive[];
  // console.log('🚀 ~ schedule:', schedule);
</script>

{#if schedule}
  <div class="dboard__grid__item control-widget">
    <div class="dboard__card">
      <Icon
        icon="mynaui:train"
        height={300}
        color="red"
        class="absolute right-[-6rem] top-[-3rem] opacity-65"
      />
      <table class="septa">
        {#each schedule as train}
          <tr class="septa__train">
            <td>{train.orig_departure_time}</td>
            <td class="delay">
              {train.orig_delay}
            </td>
            <td class="arrive">
              {train.orig_arrival_time}
            </td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
{/if}

<style>
  .septa {
    width: 100%;
    tr {
      td {
        &.delay {
          flex-grow: 1;
          text-align: center;
        }
        &.arrive {
          text-align: right;
        }
      }
    }
  }
</style>
