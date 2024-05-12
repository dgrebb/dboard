<script lang="ts">
  import type { Weather, Time } from '$lib/stores/location.svelte';
  type Props = {
    weather: Weather;
    time: Time;
  };
  let { weather, time }: Props = $props();
</script>

<p>
  {time.totalSeconds}
  {time.hours?.toString().padStart(2, '0')}:{time.minutes
    ?.toString()
    .padStart(2, '0')}:{time.seconds}
</p>
<h1>its cold {weather.apparent_temperature}</h1>
