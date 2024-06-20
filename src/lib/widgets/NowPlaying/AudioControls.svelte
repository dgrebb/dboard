<script lang="ts">
  import { Button } from 'flowbite-svelte';

  const sendCommand = async (command: string) => {
    await fetch(`/api/control/music/${command}`);
  };
</script>

<div class="audio-controls z-10 flex w-full flex-row justify-around pb-3">
  <Button size="lg" color="yellow" onclick={() => sendCommand('prev')}
    >Previous</Button
  >
  <Button size="lg" color="yellow" onclick={() => sendCommand('resume')}
    >Play</Button
  >
  <Button size="lg" color="yellow" onclick={() => sendCommand('pause')}
    >Pause</Button
  >
  <Button size="lg" color="yellow" onclick={() => sendCommand('next')}
    >Next</Button
  >
</div>
