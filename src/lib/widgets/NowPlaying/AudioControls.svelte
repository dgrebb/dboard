<script lang="ts">
  import { Button } from 'flowbite-svelte';

  const sendCommand = async (event: MouseEvent, command: string) => {
    event.preventDefault();
    await fetch(`/api/control/music/${command}`);
  };
</script>

<div class="audio-controls z-10 flex w-full flex-row justify-around pb-3">
  <Button
    size="lg"
    color="yellow"
    onclick={(e: MouseEvent) => sendCommand(e, 'prev')}>Previous</Button
  >
  <Button
    size="lg"
    color="yellow"
    onclick={(e: MouseEvent) => sendCommand(e, 'resume')}>Play</Button
  >
  <Button
    size="lg"
    color="yellow"
    onclick={(e: MouseEvent) => sendCommand(e, 'pause')}>Pause</Button
  >
  <Button
    size="lg"
    color="yellow"
    onclick={(e: MouseEvent) => sendCommand(e, 'next')}>Next</Button
  >
</div>
