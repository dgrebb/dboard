<script lang="ts">
  import Icon from '@iconify/svelte';
  import fahrenheitToColorShade from './tempColor';
  import { fade, blur } from 'svelte/transition';
  import WeatherIcon from './WeatherIcon.svelte';
  import weather from '$lib/stores/weather';

  $: ({
    temperature_2m: current,
    weather_code: weatherCode,
    wind_speed_10m: windSpeed,
    wind_direction_10m: windDirection,
    wind_gusts_10m: windGust,
    is_day: isDay,
  } = $weather);
  $: highlightColor = fahrenheitToColorShade(current);
  $: touched = false;
  let unique: {};

  function handleTouched() {
    unique = {};
  }
</script>

{#key unique}
  <div
    on:click={handleTouched}
    on:keydown={handleTouched}
    tabindex="-1"
    out:blur={{ duration: 333 }}
    in:blur={{ delay: 333, duration: 333 }}
    role="button"
    class="dboard__grid__item current-weather relative transition-colors"
  >
    {#key weather}
      <div
        class="dboard__card border-none bg-transparent"
        style={`--mainColor: ${highlightColor}`}
      >
        <h2 class="text-[var(--mainColor)] brightness-75 dark:saturate-200">
          Lansdale
          <Icon
            icon="ei:arrow-up"
            class="current-weather__wind-direction inline-block mix-blend-darken brightness-50 dark:brightness-200"
            width={27}
            style={`transform: rotate(${(windDirection + 180) % 360}deg);`}
            color={highlightColor}
          />
        </h2>
        <div class="current-weather__wind">
          <p
            class="text-sm text-[var(--mainColor)] brightness-50 dark:brightness-150"
          >
            {windSpeed} ↝ {windGust}mph
          </p>
        </div>
        {#key isDay}
          <WeatherIcon {weatherCode} {isDay} />
        {/key}
        <h1
          class="dboard__card--value-lg mt-auto justify-end text-9xl text-[var(--mainColor)] brightness-50 dark:brightness-150 dark:saturate-200"
        >
          {Math.round(current)}<span
            class="dboard__card__value-symbol text-[var(--mainColor)] brightness-125 dark:brightness-150"
            >&deg;</span
          >
        </h1>
      </div>
    {/key}
  </div>
{/key}
