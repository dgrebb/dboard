<script>
  import { getContext, setContext } from 'svelte';
  import createWeatherInstance from '$lib/stores/weather.svelte';
  import Component from './component.svelte';

  let weather = createWeatherInstance({ temp: 44.4 });

  const data = {
    temp: 50.23,
  };

  function handleSetWeather() {
    weather = data;
  }
</script>

<button on:click={handleSetWeather}>Set Weather</button>
<p>{weather.temp} asd fasdf as</p>
<Component {weather} />

<style>
  /* your styles go here */
</style>
