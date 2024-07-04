<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let showWidgetTypeModal = $state(false);
  let mounted = $state(false);
  const createNewWidget = function (type: string) {
    console.info('type of widget: ', type);
  };
  const handleNewWidgetClick = function () {
    console.info('show modeal');
    showWidgetTypeModal = true;
  };

  onMount(function () {
    mounted = true;
  });
</script>

<div
  class="dboard__grid__item push-to-refresh current-weather relative transition-colors"
>
  {#if mounted}
    <div class="dboard__card border-none bg-transparent" transition:fade>
      {#if !showWidgetTypeModal}
        <button
          class="flex h-full flex-col content-center justify-center text-9xl text-yellow-400 transition-colors hover:text-orange-800"
          onclick={handleNewWidgetClick}>+</button
        >
      {/if}
      {#if showWidgetTypeModal}
        <div
          class="widget-options absolute inset-0 flex flex-col justify-center bg-green-700 bg-opacity-55 text-red-300"
        >
          <button
            onclick={() => {
              createNewWidget('weather');
            }}>Weather</button
          >
          <button
            onclick={() => {
              createNewWidget('nightscout');
            }}>Nightscout</button
          >
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .widget-options {
    button {
      margin: 0.25rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background-color: rgba(255, 255, 255, 0.3);
      padding: 0.25rem;
      &:hover {
        background-color: rgba(255, 255, 233, 0.5);
      }
    }
  }
</style>
