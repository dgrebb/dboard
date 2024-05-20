<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { WeatherType } from '$root/lib/stores';
  import mapWeatherIcon from '$components/widgets/Weather/iconMap';
  import { fade } from 'svelte/transition';
  type Props = {
    daily: WeatherType['daily'];
  };
  let { daily }: Props = $props();

  type IconProps = {
    icon: string;
    color: string;
    name: string;
  };

  let icon = $state('data-sunburst-24-filled');
  let color = $state('#85aba0');
  let name = $state('Loading');
</script>

{#if daily.weather_code}
  <div class="weather-forecast" transition:fade>
    <h1>Forecast</h1>
    <ul class="flex flex-row">
      {#each daily.weather_code as code, index}
        {@const i = mapWeatherIcon(Number(code), 1)}
        <li class="">
          <h2>{daily.time[index]}</h2>
          {#if i.icon !== undefined}
            <p class="absolute self-end p-3 text-slate-500">{i.name}</p>
            <Icon
              icon={i.icon}
              color={i.color}
              width={200}
              class="icon self-end"
            />
          {:else}
            <Icon icon="meteocons:not-available-fill" width={200} />
            <p>{code}</p>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  li,
  h1,
  h2 {
    color: var(--bgColor);
    filter: invert();
  }
</style>
