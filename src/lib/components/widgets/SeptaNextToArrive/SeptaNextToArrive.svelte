<script lang="ts">
  import type { SeptaDataNextToArrive } from '$lib/types';
  export let schedule: SeptaDataNextToArrive[];
  // console.log('🚀 ~ schedule:', schedule);
</script>

{#if schedule}
  <div class="dboard__grid__item control-widget">
    <div class="dboard__card">
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
