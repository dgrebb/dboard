<script>
  import LovedHeart from '$components/Animations/LovedHeart.svelte';
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
    <LovedHeart loved={np.loved} size={33} />
    <img
      class="h-[200px]"
      src={np.art}
      alt={`Artwork for the album ${np.album} by ${np.artist}`}
    />
  </div>
</div>
