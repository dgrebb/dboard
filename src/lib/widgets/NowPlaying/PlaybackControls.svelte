<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  type Props = {
    setTrackChange: () => void;
    classes: string;
  };

  let { classes, setTrackChange }: Props = $props();

  /**
   * Send a command to control music playback.
   *
   * @param event - The mouse event triggered by the button click.
   * @param command - The command to send (e.g., 'prev', 'resume', 'pause', 'next').
   */
  const sendCommand = async (event: MouseEvent, command: string) => {
    event.stopPropagation();
    try {
      await fetch(`/api/control/music/${command}`, { method: 'POST' });
    } catch (e) {
      console.log(`Error processing the music control:`);
      console.error(e);
    }
  };

  const handleNext = (e: MouseEvent) => {
    e.preventDefault();
    setTrackChange();
    sendCommand(e, 'next');
  };

  const handlePrev = (e: MouseEvent) => {
    e.preventDefault();
    setTrackChange();
    sendCommand(e, 'prev');
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
  <button class="bounce-ui prev" onclick={(e: MouseEvent) => handlePrev(e)}
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
  <button class="bounce-ui" onclick={(e: MouseEvent) => handleNext(e)}
    ><Icon icon="majesticons:next-circle" height={33} width={33} /></button
  >
</div>
