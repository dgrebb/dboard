<script lang="ts">
  /* global RequestInit */
  /* global RequestRedirect */
  import { RGBtoXY } from '$lib/utils';
  import ColorPicker from 'svelte-awesome-color-picker';
  import Button from '../ui/button/button.svelte';
  import './color-picker.css';

  interface Props {
    id: string;
    actionType: string;
  }

  let { id, actionType }: Props = $props();

  let hex = $state('#4b38fa');

  let rgb = $state({
    r: 75,
    g: 56,
    b: 250,
    a: 1,
  });

  let hsv = $state({
    h: 246,
    s: 77.75,
    v: 98.09166717529297,
    a: 1,
  });

  let { r, g, b, a } = $derived(rgb);
  let x: number = $state(0);
  let y: number = $state(0);
  let bri: number = $state(0);
  let lightState: Record<string, unknown> = {
    on: true,
    xy: [0, 0],
    bri: 0,
  };

  let XY: number[] = $derived(RGBtoXY(r, g, b));

  $effect(() => {
    [x, y] = XY;
    bri = a * 100;
  });

  const setLightState = async (
    actionType: string,
    lightId: string,
    XY: number[],
    bri: number
  ) => {
    lightState = {
      on: true,
      xy: XY,
      bri,
    };
    const apiPath = actionType === 'groups' ? 'action' : 'state';
    const url = `/api/control/hue/${actionType}/${lightId}/${apiPath}`;
    const headers = new Headers();
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers,
      body: JSON.stringify(lightState),
      redirect: 'follow' as RequestRedirect,
    };
    try {
      return await fetch(url, requestOptions);
    } catch (err) {
      console.error(err);
    }
  };
</script>

<ul>
  <li>x: {x}</li>
  <li>y: {y}</li>
  <li>b: {bri}</li>
</ul>
<ColorPicker bind:hex bind:rgb bind:hsv position="responsive" />
<Button
  onclick={() => {
    setLightState(actionType, id, XY, bri);
  }}>Apply COlor</Button
>

<style>
</style>
