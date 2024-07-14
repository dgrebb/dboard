<script lang="ts">
  import { onMount } from 'svelte';
  import type { Component } from 'svelte';
  import Icon from '@iconify/svelte';
  import mapWeatherIcon from '$widgets/Weather/iconMap';
  import components, {
    type WeatherIconComponent,
  } from '$components/WeatherIcons';

  /**
   * A map of component names to their corresponding Svelte components.
   *
   * @type {Record<string, Component<object>>}
   */
  let weatherIconComponents: Record<string, Component<object>> = components;

  /**
   * Properties for the WeatherIcon component.
   *
   * @typedef {Object} Props
   * @property {number} weatherCode - The weather code representing the weather condition.
   * @property {number} isDay - Indicates whether it is day (1) or night (0).
   */
  type Props = {
    weatherCode: number;
    isDay: number;
  };

  let { weatherCode, isDay }: Props = $props();
  let icon: string | undefined = $state(undefined);
  let color = $state('#85aba0');
  let component: WeatherIconComponent | false = $state(false);
  let name = $state('Loading');

  onMount(() => {
    const mappedIcon = mapWeatherIcon(weatherCode, isDay);
    icon = mappedIcon.icon;
    color = mappedIcon.color;
    component = mappedIcon.component || false; // Ensure component is either string or false
    name = mappedIcon.name;
  });
</script>

<div class="big-icon-wow right-0 flex flex-col items-end">
  {#if typeof component === 'string'}
    <div class="w-[9rem]">
      <svelte:component this={weatherIconComponents[component]} />
    </div>
  {:else if icon !== undefined}
    <p class="absolute self-end p-3 text-slate-500">{name}</p>
    <Icon {icon} {color} width={200} class="self-end" />
  {:else}
    <Icon icon="meteocons:not-available-fill" width={200} />
    <p>{weatherCode}</p>
  {/if}
</div>
