<script lang="ts">
  import * as Sheet from '$lib/components/ui/sheet';
  import OnOff from '$lib/widgets/Hue/OnOff.svelte';
  import './home-control-panel.css';

  // interface Props {
  //   shoes: string;
  // }

  // let { shoes }: Props = $props();
  // console.log('🚀 ~ shoes:', shoes);
</script>

<div class="home-control-panel">
  <Sheet.Root>
    <Sheet.Trigger>Open</Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Play around with some settings</Sheet.Title>
        <Sheet.Description>
          These will be saved to your browser's storage for now.
        </Sheet.Description>
      </Sheet.Header>
      <OnOff />
    </Sheet.Content>
  </Sheet.Root>
</div>
