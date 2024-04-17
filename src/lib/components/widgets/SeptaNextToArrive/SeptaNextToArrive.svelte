<script lang="ts">
  import type { SeptaDataNextToArrive } from '$lib/types';
  export let schedule: SeptaDataNextToArrive[];
  console.log('🚀 ~ schedule:', schedule);
</script>

{#if schedule}
  {#each schedule as train}
    <ul class="septa">
      <li class="septa__train">
        <dl>
          <dt>Train</dt>
          <dd>{train.orig_train}</dd>
        </dl>
        <dl>
          <dt>Departing</dt>
          <dd>{train.orig_departure_time}</dd>
        </dl>
        <dl>
          <dt>Arriving</dt>
          <dd>{train.orig_arrival_time}</dd>
        </dl>
        <dl>
          <dt>Delay</dt>
          <dd>{train.orig_delay}</dd>
        </dl>
      </li>
    </ul>
  {/each}
{/if}

<style>
  /* your styles go here */
</style>
