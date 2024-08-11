<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import { onMount } from 'svelte';
  // import lights from '@stores/solar';
  import Switch from '$lib/components/ui/switch/switch.svelte';
  import { isHueActionType } from '@guards';
  import { hue } from '@root/.config/settings';
  import { type HueActionType } from '@types';
  import { convertCentiDegreesToFahrenheit } from '$lib/utils/mathAndScience';

  let { actions, sensors } = $state(hue);
  let insideTemperature = $state(0.0);
  let temp = $derived(convertCentiDegreesToFahrenheit(insideTemperature));

  function lightSwitch(actionType: HueActionType, id: number) {
    const actionIndex = actions.findIndex((action) => action.light.id === id);
    const lightState = !actions[actionIndex].light.on;
    const headers = new Headers();
    const apiPath = actionType === 'groups' ? 'action' : 'state';
    const raw = `{"on":${lightState}}`;
    headers.append('Content-Type', 'text/plain');
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };
    fetch(
      `/api/control/hue/${actionType}/${id}/${apiPath}`,
      requestOptions
    ).then((response) =>
      response
        .json()
        .then(() => {
          if (typeof actionIndex === 'number') {
            actions[actionIndex].light.on = lightState;
          }
        })
        .catch((e) => {
          console.error(e);
        })
    );
  }

  // const turnLightOnOrOff = async (lightId, on, hue, sat, bri) => {
  //   const url = `http://${process.env.HUE_BRIDGE_IP}/api/${process.env.HUE_USERNAME}/lights/${lightId}/state`;
  //   try {
  //     return await axios.put(url, {
  //       on,
  //       ...(hue && { hue }),
  //       ...(sat && { sat }),
  //       ...(bri && { bri }),
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  onMount(async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow' as RequestRedirect,
    };
    actions.forEach(async (action, i) => {
      const actionState = await fetch(
        `/api/control/hue/${action.light.actionType}/${action.light.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => {
          console.error(error);
        });
      if (actionState) {
        actions[i].light.on =
          action.light.actionType === 'groups'
            ? actionState.state.any_on
            : actionState.state.on;
      }
    });
    insideTemperature = await fetch(
      `/api/control/hue/sensors/${sensors[0].id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => data.state.temperature);
  });
</script>

<div class="home-sensors">
  <h2>Interior Temperature</h2>
  <p>{temp}</p>
</div>

{#key actions}
  <div class="hue-button-container flex h-full flex-col overflow-y-scroll">
    {#each actions as { light: { name, id, on, actionType } }}
      {#if isHueActionType(actionType)}
        {name}
        <Switch
          onclick={() => {
            lightSwitch(actionType, id);
          }}
          onkeydown={() => {
            lightSwitch(actionType, id);
          }}
          checked={on}
        />
      {/if}
    {/each}
  </div>
{/key}
