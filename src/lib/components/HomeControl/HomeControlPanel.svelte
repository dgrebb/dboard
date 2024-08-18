<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import Climate from '$lib/components/HomeControl/Climate.svelte';
  import * as Sheet from '$lib/components/ui/sheet';
  import type { Group, Light } from '$lib/types';
  import * as Card from '@components/ui/card';
  import { Separator } from '@components/ui/separator';
  import { houseState } from '@stores';
  import { onMount } from 'svelte';
  import { Tabs } from 'bits-ui';
  import ColorPicker from '../ColorPicker/ColorPicker.svelte';
  import { Switch } from '../ui/switch';
  import './home-control-panel.css';
  import Icon from '@iconify/svelte';

  let syncLightsToMusic = $derived(houseState.getSyncLightsToMusic());
  let loaded = $state(false);

  const lights = $derived(
    Object.entries(houseState.getLights()).map(
      ([id, light]: [string, Light]) => ({
        id,
        ...light,
      })
    )
  );

  const groups = $derived(
    Object.entries(houseState.getGroups()).map(
      ([id, group]: [string, Group]) => ({
        id,
        ...group,
      })
    )
  );

  // TODO: Extract fetchWithRetry into a utility function
  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
  ) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      } else {
        console.error(`Failed to fetch ${url}:`, error);
        throw error;
      }
    }
  }

  onMount(async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow' as RequestRedirect,
    };

    try {
      const [lights, groups, sensors] = await Promise.all([
        fetchWithRetry(`/api/control/hue/lights`, requestOptions),
        fetchWithRetry(`/api/control/hue/groups`, requestOptions),
        fetchWithRetry(`/api/control/hue/sensors`, requestOptions),
      ]);

      houseState.setHueState({
        lights: lights.data,
        groups: groups.data,
        sensors: sensors.data,
      });

      loaded = true;
    } catch (error) {
      console.error('Failed to load actions:', error);
    }
  });
</script>

{#if loaded}
  <div class="home-control-panel">
    <Sheet.Root>
      <Sheet.Trigger>Open</Sheet.Trigger>
      <Sheet.Content>
        <Tabs.Root class="h-full">
          <Sheet.Header>
            <Sheet.Title>Home Controls</Sheet.Title>
            <Climate />
            <Card.Root class="music-controls flex">
              <Card.Content>
                <div class="grid gap-3">
                  <fieldset>
                    <legend class="mb-4 text-lg font-medium"
                      >Global Settings</legend
                    >
                    <div class="flex flex-row">
                      <Switch
                        onclick={() =>
                          houseState.setSyncLightsToMusic(!syncLightsToMusic)}
                        name="sync-lights-music-toggle"
                      />
                      <label
                        for="sync-lights-music-toggle"
                        class="flex flex-row"
                      >
                        <Icon icon="ion:bulb" />
                        <Icon icon="material-symbols-light:sync-alt" />
                        <Icon icon="basil:music-solid" />
                      </label>
                    </div>
                  </fieldset>
                </div>
                <Separator class="my-2" />
              </Card.Content>
            </Card.Root>
            <Tabs.List>
              <Tabs.Trigger value="lights">Lights</Tabs.Trigger>
              <Tabs.Trigger value="groups">Groups</Tabs.Trigger>
              <Tabs.Trigger value="scenes">Scenes</Tabs.Trigger>
              <Tabs.Trigger value="zones">Zones</Tabs.Trigger>
              <Tabs.Trigger value="rooms">Rooms</Tabs.Trigger>
            </Tabs.List>
          </Sheet.Header>
          <Card.Root
            class="h-[80%] overflow-y-scroll"
            data-x-chunk-name="dashboard-05-chunk-4"
            data-x-chunk-description="An order details card with order details, shipping information, customer information and payment information."
          >
            {#if lights}
              <Tabs.Content value="lights">
                {#each lights as light (light.id)}
                  <Card.Content class="p-6 text-sm">
                    <div class="grid gap-3">
                      <fieldset>
                        <legend class="mb-4 text-lg font-medium"
                          >{light.name}</legend
                        >
                        <Switch
                          checked={light.state.on}
                          id={light.id}
                          onclick={() => {
                            houseState.setLightOn(light.id, !light.state.on);
                          }}
                        />
                        <ColorPicker
                          id={light.id}
                          collectionState={light.state}
                          actionType="lights"
                        />
                      </fieldset>
                      <Separator class="my-2" />
                    </div>
                    <Separator class="my-4" />
                  </Card.Content>
                {/each}
              </Tabs.Content>
            {/if}

            {#if groups}
              <Tabs.Content value="groups">
                {#each groups as group (group.id)}
                  <Card.Content class="p-6 text-sm">
                    <div class="grid gap-3">
                      <fieldset>
                        <legend class="mb-4 text-lg font-medium"
                          >{group.name}</legend
                        >
                        <Switch
                          checked={group.state.any_on}
                          onclick={() => {
                            houseState.setGroupOn(
                              group.id,
                              !group.state.any_on
                            );
                          }}
                        />
                        <ColorPicker
                          id={group.id}
                          collectionState={group.state}
                          actionType="groups"
                        />
                      </fieldset>
                      <Separator class="my-2" />
                    </div>
                    <Separator class="my-4" />
                  </Card.Content>
                {/each}
              </Tabs.Content>
            {/if}
          </Card.Root>
        </Tabs.Root>
      </Sheet.Content>
    </Sheet.Root>
  </div>
{/if}
