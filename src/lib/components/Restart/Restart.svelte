<script lang="ts">
  import { Button } from 'flowbite-svelte';

  function restart() {
    // @ts-ignore
    location.reload(true);
  }
</script>

<div class="dboard__grid__item relative transition-colors">
  <Button type="button" class="relative" on:click={restart} on:keydown={restart}
    >Restart</Button
  >
</div>
