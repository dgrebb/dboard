<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  type Props = {
    setTrackChange: (e: MouseEvent | TouchEvent) => void;
    classes: string;
    buttonSize?: number;
  };

  let { buttonSize = 50, classes, setTrackChange }: Props = $props();

  /**
   * Send a command to control music playback.
   *
   * @param event - The mouse event triggered by the button click.
   * @param command - The command to send (e.g., 'prev', 'resume', 'pause', 'next').
   */
  const sendCommand = async (e: MouseEvent | TouchEvent, command: string) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    e.stopPropagation();

    try {
      await fetch(`/api/stream/music?command=${command}`, { method: 'POST' });
    } catch (error) {
      console.error(
        `Error processing the music control command: ${command}`,
        error
      );
    }
  };

  const handleNext = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    e.preventDefault();
    setTrackChange(e);
    sendCommand(e, 'next');
  };

  const handlePrev = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.button === 2) return;
    e.preventDefault();
    setTrackChange(e);
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
  <button
    class="bounce-ui prev"
    onclick={(e: MouseEvent | TouchEvent) => handlePrev(e)}
    ><Icon
      icon="majesticons:next-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button
    class="bounce-ui"
    onclick={(e: MouseEvent | TouchEvent) => sendCommand(e, 'resume')}
    ><Icon
      icon="majesticons:play-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button
    class="bounce-ui"
    onclick={(e: MouseEvent | TouchEvent) => sendCommand(e, 'pause')}
    ><Icon
      icon="bi:pause-circle-fill"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button
    class="bounce-ui"
    onclick={(e: MouseEvent | TouchEvent) => handleNext(e)}
    ><Icon
      icon="majesticons:next-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
</div>
