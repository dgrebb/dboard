<script lang="ts">
  import type { CurrentWeatherData } from '$lib/types';
  import { homeState } from '$lib/stores';
  import '$widgets/weather/weather.css';

  let temperature: CurrentWeatherData['temperature_2m'] = $state(
    homeState.currentRoundTemperature()
  );

  $effect(() => {
    temperature = homeState.currentRoundTemperature();
  });
</script>

<div class="current-weather text-white">
  <h1>{temperature}</h1>
</div>
