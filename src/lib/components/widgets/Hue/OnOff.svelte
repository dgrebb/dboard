<script lang="ts">
  import { PUBLIC_HUE_USERNAME as username } from '$env/static/public';
  import { fade } from 'svelte/transition';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  // import lights from '$lib/stores/solar';
  import { hue } from '$lib/settings.js';

  $: ({ actions } = hue);

  enum ActionType {
    lights = 'lights',
    groups = 'groups',
  }

  function lightSwitch(actionType: ActionType, id: number) {
    const actionIndex = actions.findIndex((action) => action.light.id === id);
    const lightState = !actions[actionIndex].light.on;
    const headers = new Headers();
    const apiPath = actionType === 'groups' ? 'action' : 'state';
    const raw = `{"on":${lightState}}`;
    headers.append('Content-Type', 'text/plain');
    const requestOptions = {
      method: 'PUT',
      headers,
      body: raw,
      redirect: 'follow',
    };
    fetch(
      `http://192.168.50.227/api/${username}/${actionType}/${id}/${apiPath}`,
      requestOptions
    ).then((response) =>
      response
        .json()
        .then((result) => {
          console.log('🚀 ~ .then ~ result:', result);
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
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
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
      console.log(actionState);
      actions[i].light.on =
        action.light.actionType === 'groups'
          ? actionState.state.any_on
          : actionState.state.on;
    });
  });
</script>

{#key actions}
  <div class="hue-button-container flex h-full flex-col overflow-y-scroll">
    {#each actions as { light: { name, id, on, actionType } }}
      <Button
        type="button"
        size="xl"
        on:click={() => {
          lightSwitch(actionType, id);
        }}
        on:keydown={() => {
          lightSwitch(actionType, id);
        }}
        color={on ? 'yellow' : 'dark'}>{name}</Button
      >
    {/each}
  </div>
{/key}
