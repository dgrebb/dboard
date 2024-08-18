<script lang="ts">
  import { houseState } from '$lib/stores';
  import { convertCentiDegreesToFahrenheit } from '@utils';
  import { fade } from 'svelte/transition';

  let sensorState = $state(houseState.getSensor('153') || { temperature: 0 });
  let farenheitTemp = $derived(
    convertCentiDegreesToFahrenheit(sensorState.temperature ?? 0)
  );
  let temp = $derived(farenheitTemp + 5);
</script>

<div class="home-climate">
  <div class="home-climate__sensors">
    <h2>Interior Temperature</h2>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore event_directive_deprecated -->
    {#key temp}<p
        class="interior-temperature"
        out:fade={{ duration: 333 }}
        in:fade={{ duration: 333, delay: 333 }}
        on:click={() => {
          houseState.getSensor('153');
        }}
      >
        {temp}ºF
      </p>{/key}
  </div>
</div>
