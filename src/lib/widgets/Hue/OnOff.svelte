<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import { PUBLIC_HUE_USERNAME as username } from '$env/static/public';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  // import lights from '$stores/solar';
  import { hue } from '$root/.config/settings';
  import { type HueActionType } from '$types';
  import { isHueActionType } from '$guards';

  let { actions } = $state(hue);

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
      `http://192.168.50.227/api/${username}/${actionType}/${id}/${apiPath}`,
      requestOptions
    ).then((response) =>
      response
        .json()
        .then(() => {
          typeof actionIndex === 'number'
            ? (actions[actionIndex].light.on = lightState)
            : false;
        })
        .catch((e) => {
          console.error(e);
        })
    );
  }

  onMount(async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow' as RequestRedirect,
    };
    actions.forEach(async (action, i) => {
      const actionState = await fetch(
        `http://192.168.50.227/api/${username}/${action.light.actionType}/${action.light.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => {
          return console.error(error);
        });
      if (actionState) {
        actions[i].light.on =
          action.light.actionType === 'groups'
            ? actionState.state.any_on
            : actionState.state.on;
      }
    });
  });
</script>

{#key actions}
  <div class="hue-button-container flex h-full flex-col overflow-y-scroll">
    {#each actions as { light: { name, id, on, actionType } }}
      {#if isHueActionType(actionType)}
        <Button
          type="button"
          size="xl"
          onclick={() => {
            lightSwitch(actionType, id);
          }}
          onkeydown={() => {
            lightSwitch(actionType, id);
          }}
          color={on ? 'yellow' : 'dark'}>{name}</Button
        >
      {/if}
    {/each}
  </div>
{/key}
