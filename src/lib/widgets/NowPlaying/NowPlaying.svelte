<script>
  import { homeState } from '$lib/stores';

  let np = homeState.getNowPlaying();
</script>

<div class="dboard__grid__item relative text-white">
  <h1>{np.artist}</h1>
  <h1>{np.title}</h1>
  <h1>{np.album}</h1>
  <img
    class="h-[200px]"
    src={np.art}
    alt={`Artwork for the album ${np.album} by ${np.artist}`}
  />
</div>

<style>
  /* your styles go here */
</style>
