<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';

  function restart() {
    location.reload();
  }
</script>

<Button type="button" size="xl" on:click={restart} on:keydown={restart}
  ><Icon icon="clarity:power-solid" class="me-2 h-6 w-6" />Restart</Button
>
