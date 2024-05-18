<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import iconMap from '$components/widgets/Weather/iconMap';
  import type { WeatherType } from '$root/lib/stores';
  import mapWeatherIcon from '$components/widgets/Weather/iconMap';
  type Props = {
    daily: WeatherType['daily'];
    isDay: WeatherType['current']['isDay'];
  };
  let { daily, isDay }: Props = $props();

  type IconProps = {
    icon: string;
    color: string;
    name: string;
  };

  let icon = $state('data-sunburst-24-filled');
  let color = $state('#85aba0');
  let name = $state('Loading');
</script>

<div class="weather-forecast">
  <h1>Forecast</h1>
  <ul class="flex flex-row">
    {#each daily.weather_code as code, index}
      {@const i = mapWeatherIcon(Number(code), isDay)}
      <li class="">
        <h2>{daily.time[index]}</h2>
        {#if i.icon !== undefined}
          <p class="absolute self-end p-3 text-slate-500">{i.name}</p>
          <Icon icon={i.icon} color={i.color} width={200} class="self-end" />
        {:else}
          <Icon icon="meteocons:not-available-fill" width={200} />
          <p>{code}</p>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
</style>
