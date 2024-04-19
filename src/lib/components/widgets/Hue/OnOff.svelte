<script lang="ts">
  import { PUBLIC_HUE_USERNAME as username } from '$env/static/public';
  import { fade } from 'svelte/transition';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  // import lights from '$lib/stores/solar';
  import { hue } from '$lib/settings.js';

  const { groups } = hue;

  $: on = false satisfies boolean;

  function handleSwitch() {
    const lightState = !on;
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
      `http://192.168.50.227/api/${username}/groups/${groups.chill.id}/action`,
      requestOptions
    ).then((response) =>
      response
        .json()
        .then((result) => {
          on = lightState;
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
    const groupState = await fetch(
      `http://192.168.50.227/api/${username}/groups/1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error(error));
    on = groupState.action.on;
  });
</script>

{#key on}
  <Button
    type="button"
    size="xl"
    on:click={handleSwitch}
    on:keydown={handleSwitch}
    color={on ? 'dark' : 'yellow'}>Living room is {on ? 'on' : 'off'}</Button
  >
{/key}
