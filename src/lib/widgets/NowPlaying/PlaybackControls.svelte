<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  type Props = {
    setTrackChange: (e: MouseEvent | TouchEvent) => void;
    classes: string;
    buttonSize?: number;
    setupEventSource: () => Promise<void>;
    stopEventSource: () => Promise<void>;
  };

  let {
    buttonSize = 50,
    classes,
    setTrackChange,
    stopEventSource,
    setupEventSource,
  }: Props = $props();

  /**
   * Send a command to control music playback.
   *
   * @param event - The mouse event triggered by the button click.
   * @param command - The command to send (e.g., 'prev', 'resume', 'pause', 'next').
   */
  const sendCommand = async (e: MouseEvent, command: string) => {
    if (e.button === 2) return;
    e.stopPropagation();
    console.log('🚀 ~ sendCommand ~ command:', command);

    stopEventSource(); // Pause the SSE stream

    try {
      await fetch(`/api/control/music/${command}`, { method: 'POST' });
    } catch (e) {
      console.info(`Error processing the music control:`);
      console.error(e);
    } finally {
      await setupEventSource(); // Resume the SSE stream
    }
  };

  const handleNext = (e: MouseEvent) => {
    if (e.button === 2) return;
    e.preventDefault();
    setTrackChange(e);
    sendCommand(e, 'next');
  };

  const handlePrev = (e: MouseEvent) => {
    if (e.button === 2) return;
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
  <button class="bounce-ui prev" onclick={(e: MouseEvent) => handlePrev(e)}
    ><Icon
      icon="majesticons:next-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button
    class="bounce-ui"
    onclick={(e: MouseEvent) => sendCommand(e, 'resume')}
    ><Icon
      icon="majesticons:play-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button class="bounce-ui" onclick={(e: MouseEvent) => sendCommand(e, 'pause')}
    ><Icon
      icon="bi:pause-circle-fill"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
  <button class="bounce-ui" onclick={(e: MouseEvent) => handleNext(e)}
    ><Icon
      icon="majesticons:next-circle"
      height={buttonSize}
      width={buttonSize}
    /></button
  >
</div>
