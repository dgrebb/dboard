<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    weatherCode: number;
    name: string;
  }

  let { weatherCode, name }: Props = $props();
</script>

<h1 class="absolute self-end p-3 text-white mix-blend-difference">{name}</h1>
<Icon icon="meteocons:not-available-fill" width={200} />
<p>{weatherCode}</p>
