<script>
  import { homeState } from '$lib/stores';
  import Icon from '@iconify/svelte';

  let np = $derived(homeState.getNowPlaying());
  let weather = homeState.getWeather();

  $effect(() => {
    weather = homeState.getWeather();
  });
</script>

<div class="now-playing dboard__grid__item relative text-white">
  <h1 class="text-3xl">{weather?.current?.temperature_2m}</h1>
  <h1>{np.artist}</h1>
  <h1>{np.title}</h1>
  <h1>{np.album}</h1>
  <div class="album-art relative inline-block">
    {#if np.loved === true}<Icon
        icon="emojione-monotone:heart-decoration"
        width={33}
        height={33}
        class="loved-heart absolute rounded-full bg-[rgba(255,33,33,0.5)]"
      />{/if}
    <img
      class="h-[200px]"
      src={np.art}
      alt={`Artwork for the album ${np.album} by ${np.artist}`}
    />
  </div>
</div>

<style>
  /* your styles go here */
</style>
