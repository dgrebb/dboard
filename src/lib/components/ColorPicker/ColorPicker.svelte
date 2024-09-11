<script lang="ts">
  import { houseState } from '$lib/stores';
  import type {
    GroupAction,
    GroupState,
    LightAction,
    LightState,
  } from '@types';
  import { rgbToXyBri } from '$lib/utils';
  import ColorPicker from 'svelte-awesome-color-picker';
  import Button from '../ui/button/button.svelte';
  import './color-picker.css';
  interface Props {
    id: string;
    actionType: string;
    collectionState: LightState | GroupState;
  }

  let { id, actionType, collectionState }: Props = $props();

  let rgb = $state({
    r: 75,
    g: 56,
    b: 250,
    a: 1.0,
  });

  let x: number = $state(0),
    y: number = $state(0),
    bri: number = $state(0);

  $effect(() => {
    const { r, g, b, a } = rgb;
    ({ x, y, bri } = rgbToXyBri({ r, g, b }, a));

    if (actionType === 'lights') {
      // Type guard to ensure collectionState is treated as LightState
      const lightState = collectionState as LightState;

      // Ensure that 'bri' is not undefined
      if (bri === undefined) {
        bri = 0; // or any default value you deem appropriate
      }

      collectionState = {
        ...lightState,
        on: lightState.on || false,
        xy: [x, y],
        bri,
      };
    } else {
      // Type guard to ensure collectionState is treated as GroupState
      const groupState = collectionState as GroupState;

      collectionState = {
        ...groupState,
        on: groupState.any_on || false,
        xy: [x, y],
        bri,
      };
    }
  });

  const setState = async (id: string, actionType: string) => {
    if (actionType === 'lights') {
      houseState.setLightState(id, collectionState as LightAction);
    } else {
      houseState.setGroupState(id, collectionState as GroupAction);
    }
  };
</script>

<!-- <ul>
  <li>x: {x.toFixed(4)}</li>
  <li>y: {y.toFixed(4)}</li>
  <li>bri: {bri}</li>
</ul> -->
<div class="colorpicker flex w-full justify-between">
  <ColorPicker
    bind:rgb
    position="responsive"
    isAlpha
    isDark={true}
    isTextInput={false}
  />
  <div class="color-dialog"></div>
  <Button
    onclick={() => {
      setState(id, actionType);
    }}>Apply Color</Button
  >
</div>

<style>
</style>
