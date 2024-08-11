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
        <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
        <Sheet.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </Sheet.Description>
        <OnOff />
      </Sheet.Header>
    </Sheet.Content>
  </Sheet.Root>
</div>
