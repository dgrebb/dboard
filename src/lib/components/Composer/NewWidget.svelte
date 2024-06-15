<script lang="ts">
  let showWidgetTypeModal = $state(false);
  const createNewWidget = function (type: string) {
    console.log('type of widget: ', type);
  };
  const handleNewWidgetClick = function () {
    console.log('show modeal');
    showWidgetTypeModal = true;
  };
</script>

<div
  class="dboard__grid__item push-to-refresh current-weather relative transition-colors"
>
  <div class="dboard__card border-none bg-transparent">
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
          onclick={(e) => {
            createNewWidget('weather');
          }}>Weather</button
        >
        <button
          onclick={(e) => {
            createNewWidget('nightscout');
          }}>Nightscout</button
        >
      </div>
    {/if}
  </div>
</div>

<style>
  .widget-options {
    button {
      padding: 0.25rem;
      background-color: rgba(255, 255, 255, 0.3);
      margin: 0.25rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.6);
      &:hover {
        background-color: rgba(255, 255, 233, 0.5);
      }
    }
  }
</style>
