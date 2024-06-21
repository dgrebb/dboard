<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  /**
   * Props for the AudioControls component.
   */
  type Props = {
    classes: string;
  };

  export let classes: string;

  /**
   * Send a command to control music playback.
   *
   * @param event - The mouse event triggered by the button click.
   * @param command - The command to send (e.g., 'prev', 'resume', 'pause', 'next').
   */
  const sendCommand = async (event: MouseEvent, command: string) => {
    event.stopPropagation();
    await fetch(`/api/control/music/${command}`);
  };

  onMount(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const nope = () => {};
      document
        .querySelectorAll('button')
        .forEach((button) =>
          button.addEventListener('touchstart', nope, false)
        );
    }
  });
</script>

<div class={classes}>
  <button
    class="bounce-ui prev"
    onclick={(e: MouseEvent) => sendCommand(e, 'prev')}
    ><Icon icon="majesticons:next-circle" height={33} width={33} /></button
  >
  <button
    class="bounce-ui"
    onclick={(e: MouseEvent) => sendCommand(e, 'resume')}
    ><Icon icon="majesticons:play-circle" height={33} width={33} /></button
  >
  <button class="bounce-ui" onclick={(e: MouseEvent) => sendCommand(e, 'pause')}
    ><Icon icon="bi:pause-circle-fill" height={33} width={33} /></button
  >
  <button class="bounce-ui" onclick={(e: MouseEvent) => sendCommand(e, 'next')}
    ><Icon icon="majesticons:next-circle" height={33} width={33} /></button
  >
</div>
