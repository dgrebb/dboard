<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import { onMount } from 'svelte';
  import { convertCentiDegreesToFahrenheit } from '$lib/utils/mathAndScience';
  import { hue } from '@root/.config/settings';
  import { fade } from 'svelte/transition';

  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow' as RequestRedirect,
  };

  const getSensor = async (id: number) => {
    insideTemperature = await fetch(
      `/api/control/hue/sensors/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => data.state.temperature);
  };

  let { sensors } = $state(hue);
  let insideTemperature = $state(0.0);
  let temp = $derived(convertCentiDegreesToFahrenheit(insideTemperature));

  onMount(async () => {
    await getSensor(sensors[0].id);
  });
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
          getSensor(sensors[0].id);
        }}
      >
        {temp + 5}ºF
      </p>{/key}
  </div>
</div>
