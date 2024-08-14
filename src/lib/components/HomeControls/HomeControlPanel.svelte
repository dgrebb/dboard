<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import { Button } from '$lib/components/ui/button';
  import * as Sheet from '$lib/components/ui/sheet';
  import type { Group, Light, SensorInfo } from '$lib/types';
  import * as Card from '@components/ui/card';
  import * as DropdownMenu from '@components/ui/dropdown-menu';
  import { Separator } from '@components/ui/separator';
  import { houseState } from '@stores';
  import { EllipsisVertical } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import Switch from '../ui/switch/switch.svelte';
  import Climate from './Climate.svelte';

  import './home-control-panel.css';
  import ColorPicker from '../ColorPicker/ColorPicker.svelte';

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

  const sensors = $derived(
    Object.entries(houseState.getSensors()).map(
      ([id, sensor]: [string, SensorInfo]) => ({
        id,
        ...sensor,
      })
    )
  );

  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
  ) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 && retries > 0) {
        // Handle rate limiting by waiting for some time before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
      } else {
        console.error(`Failed to fetch ${url}:`, error);
        throw error;
      }
    }
  }

  $effect(() => {
    console.log(lights, groups, sensors);
  });

  onMount(async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow' as RequestRedirect,
    };

    try {
      const fetchPromises = [];

      fetchPromises.push(
        fetchWithRetry(`/api/control/hue/lights`, requestOptions)
      );
      fetchPromises.push(
        fetchWithRetry(`/api/control/hue/groups`, requestOptions)
      );
      fetchPromises.push(
        fetchWithRetry(`/api/control/hue/sensors`, requestOptions)
      );

      const [lights, groups, sensors] = await Promise.all(fetchPromises);
      houseState.setHouseState({ lights, groups, sensors });

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
        <Sheet.Header>
          <Sheet.Title>Home Controls</Sheet.Title>
          <Climate />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                size="icon"
                variant="outline"
                class="h-8 w-8"
              >
                <EllipsisVertical class="h-3.5 w-3.5" />
                <span class="sr-only">More</span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item>Edit</DropdownMenu.Item>
              <DropdownMenu.Item>Export</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Trash</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sheet.Header>
        <Card.Root
          class="h-[80%] overflow-y-scroll"
          data-x-chunk-name="dashboard-05-chunk-4"
          data-x-chunk-description="An order details card with order details, shipping information, customer information and payment information."
        >
          {#each lights as light}
            <Card.Content class="p-6 text-sm">
              <div class="grid gap-3">
                <fieldset>
                  <legend class="mb-4 text-lg font-medium">{light.name}</legend>
                  <Switch
                    checked={light.state.on}
                    onclick={() => {
                      houseState.setLightOn(light.id, !light.state.on);
                    }}
                  />

                  <ColorPicker id={light.id} actionType="lights" />
                </fieldset>
                <Separator class="my-2" />
              </div>
              <Separator class="my-4" />
            </Card.Content>
          {/each}
          <!-- {#each actions as action}
            <Card.Content class="p-6 text-sm">
              <div class="grid gap-3">
                <fieldset>
                  <legend class="mb-4 text-lg font-medium"
                    >{action.light.name}</legend
                  >
                  <OnOff {action} {lightSwitch} />
                </fieldset>
                <Separator class="my-2" />
              </div>
              <Separator class="my-4" />
            </Card.Content>
          {/each} -->
        </Card.Root>
      </Sheet.Content>
    </Sheet.Root>
  </div>
{/if}
