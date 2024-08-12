<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import * as Sheet from '$lib/components/ui/sheet';
  import OnOff from '$lib/widgets/Hue/OnOff.svelte';
  import { EllipsisVertical } from 'lucide-svelte';
  import Climate from './Climate.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '@components/ui/dropdown-menu';
  import { Separator } from '@components/ui/separator';
  import * as Card from '@components/ui/card';

  import './home-control-panel.css';

  import { hue } from '@root/.config/settings';
  import { onMount } from 'svelte';
  let { actions } = $state(hue);

  function lightSwitch(actionType: string, id: number) {
    const device = actions.filter((action) => {
      return action.light.id === id;
    });
    const headers = new Headers();
    const apiPath = actionType === 'groups' ? 'action' : 'state';
    const raw = JSON.stringify({
      on: !device[0].light.on,
    });
    headers.append('Content-Type', 'application.json');
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
      response.json().catch((e) => {
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
  });
</script>

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
        {#each actions as action}
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
        {/each}
      </Card.Root>
    </Sheet.Content>
  </Sheet.Root>
</div>
