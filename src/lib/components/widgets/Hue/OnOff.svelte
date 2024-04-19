<script lang="ts">
  import { PUBLIC_HUE_USERNAME as username } from '$env/static/public';
  import { fade } from 'svelte/transition';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  // import lights from '$lib/stores/solar';
  import { hue } from '$lib/settings.js';

  $: ({ groups } = hue);

  function lightSwitch(id: number) {
    const group = groups.findIndex((group) => group.light.id === id);
    const lightState = !groups[group].light.on;
    const headers = new Headers();
    const raw = `{"on":${lightState}}`;
    headers.append('Content-Type', 'text/plain');
    const requestOptions = {
      method: 'PUT',
      headers,
      body: raw,
      redirect: 'follow',
    };
    fetch(
      `http://192.168.50.227/api/${username}/groups/${id}/action`,
      requestOptions
    ).then((response) =>
      response
        .json()
        .then((result) => {
          group ? (groups[group].light.on = lightState) : false;
          console.log(result);
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
    console.log('🚀 ~ groups.forEach ~ groups:', groups);
    groups.forEach(async (group, i) => {
      const groupState = await fetch(
        `http://192.168.50.227/api/${username}/groups/${group.light.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => {
          return console.error(error);
        });
      groups[i].light.on = groupState.state.any_on;
    });
  });
</script>

{#key groups}
  {#each groups as { light: { name, id, on } }}
    <Button
      type="button"
      size="xl"
      on:click={() => {
        lightSwitch(id);
      }}
      on:keydown={() => {
        lightSwitch(id);
      }}
      color={on ? 'dark' : 'yellow'}>{name}</Button
    >
  {/each}
{/key}
