<script lang="ts">
  import Icon from '@iconify/svelte';

  type Props = {
    weatherCode: number;
  };

  let { weatherCode } = <Props>$props();
</script>

<p class="absolute self-end p-3 text-slate-500">{name}</p>
<Icon icon="meteocons:not-available-fill" width={200} />
<p>{weatherCode}</p>
