<script>
  import { invalidateAll } from '$app/navigation';
  import '$lib/app.pcss';
  import { Button, DarkMode } from 'flowbite-svelte';
  import { RefreshOutline } from 'flowbite-svelte-icons';

  function refresh() {
    invalidateAll();
    localStorage.removeItem('color-theme');
  }
</script>

<main>
  <slot name="countdown-bar" />
  <header class="flex flex-row justify-between p-3">
    <slot name="additional-controls" />
    <DarkMode class="mix-blend-difference" />
    <Button
      size="sm"
      color="light"
      on:click={() => refresh()}
      class="border-opacity-0 bg-opacity-25 mix-blend-difference"
      ><RefreshOutline /></Button
    >
  </header>
  <slot />
</main>

<slot name="footer" />
