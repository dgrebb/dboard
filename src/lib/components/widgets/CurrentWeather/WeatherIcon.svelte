<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import mapWeatherIcon from '../Weather/iconMap';

  type Props = {
    weatherCode: number;
    isDay: number;
  };

  let { weatherCode, isDay }: Props = $props();
  let icon = $state('data-sunburst-24-filled');
  let color = $state('#85aba0');
  let name = $state('Loading');

  // console.log('🚀 ~ weatherCode:', weatherCode);

  onMount(() => {
    ({ icon, color, name } = mapWeatherIcon(weatherCode, isDay));
  });
</script>

<div class="big-icon-wow right-0 flex flex-col items-end">
  {#if icon !== undefined}
    <p class="absolute self-end p-3 text-slate-500">{name}</p>
    a ssdfasd fasdfasd
    <p>{weatherCode}</p>
    <Icon {icon} {color} width={200} class="self-end" />
  {:else}
    <Icon icon="meteocons:not-available-fill" width={200} />
    <p>{weatherCode}</p>
  {/if}
</div>
