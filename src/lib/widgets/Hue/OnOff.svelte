<script lang="ts">
  // import lights from '@stores/solar';
  import Switch from '@components/ui/switch/switch.svelte';
  import { type HueAction } from '@types';

  interface Props {
    action: HueAction;
    lightSwitch: (actionType: string, id: string) => void;
  }

  let { action, lightSwitch }: Props = $props();
</script>

{#key action}
  <div class="hue-button-container">
    <Switch
      onclick={() => {
        lightSwitch(action.light.actionType, action.light.id);
      }}
      onkeydown={(e) => {
        e.preventDefault();
        return false;
      }}
      bind:checked={action.light.on}
    />
  </div>
{/key}
