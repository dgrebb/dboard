<script lang="ts">
  import components from '@components/WeatherIcons';
  import { type WeatherIconComponent } from '@components/WeatherIcons/WeatherIcons.types';
  import mapWeatherIcon from '@widgets/Weather/iconMap';
  import type { Component } from 'svelte';
  import { onMount } from 'svelte';

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
  interface Props {
    weatherCode: number;
    isDay: number;
  }

  let { weatherCode, isDay }: Props = $props();
  let component: WeatherIconComponent = $state('IconNotFound');
  let name = $state('Loading');
  // let icon: string | undefined = $state(undefined);
  // let color = $state('#85aba0');

  onMount(() => {
    const mappedIcon = mapWeatherIcon(weatherCode, isDay);
    component = mappedIcon.component || component; // Ensure component is either string or false
    name = mappedIcon.name;
    // icon = mappedIcon.icon;
    // color = mappedIcon.color;
  });
</script>

<div class="big-icon-wow">
  <span data-test="weather-icon-code">{weatherCode}</span>
  <svelte:component
    this={weatherIconComponents[component]}
    {weatherCode}
    {name}
  />
</div>
