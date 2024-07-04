<script lang="ts">
  import legTime from '$lib/stores/legTime';
  import solar from '$lib/stores/solar';
  import weather from '$lib/stores/weatherLeg';
  import { onMount } from 'svelte';
  import Clouds from './Clouds.svelte';

  export let cloudCover: number = 0;
  let riseMinutes = 7 * 60;
  let setMinutes = 19 * 60;

  function init() {
    // Styles
    const style = ['style1', 'style2', 'style3', 'style4'];
    const tam = ['tam1', 'tam1', 'tam1', 'tam2', 'tam3'];
    const opacity = [
      'opacity1',
      'opacity1',
      'opacity1',
      'opacity2',
      'opacity2',
      'opacity3',
    ];

    // Utility to get random integer within range
    const getRandomArbitrary = (min, max) =>
      Math.floor(Math.random() * (max - min)) + min;

    // Prepare stars
    let starsHTML = '';
    const qtdeEstrelas = 250;
    const widthWindow = window.innerWidth * 2;
    const heightWindow = window.innerHeight * 2;

    for (let i = 0; i < qtdeEstrelas; i++) {
      starsHTML += `<span class='estrela ${style[getRandomArbitrary(0, style.length)]} 
      ${opacity[getRandomArbitrary(0, opacity.length)]} 
      ${tam[getRandomArbitrary(0, tam.length)]}' 
      style='animation-delay: .${getRandomArbitrary(0, 9)}s; 
      left: ${getRandomArbitrary(0, widthWindow)}px; 
      top: ${getRandomArbitrary(0, heightWindow)}px;'></span>`;
    }

    // Append stars to the container
    const nightSky = document.querySelector('.constelacao');
    if (nightSky) nightSky.innerHTML = starsHTML;
  }

  $: rise = new Date($solar?.sunrise[0]) || false;
  $: set = new Date($solar?.sunset[0]) || false;
  if (rise && set) {
    riseMinutes = rise.getHours() * 60 + rise.getMinutes();
    setMinutes = set.getHours() * 60 + set.getMinutes();
  }
  if ($weather) {
    cloudCover = $weather.cloud_cover;
  }

  $: twilightOpacity =
    $legTime < riseMinutes - 60 || $legTime > setMinutes + 120
      ? 0.9999
      : $legTime > riseMinutes && $legTime < setMinutes
        ? 0.0
        : $legTime > 1140
          ? ($legTime + 30 - setMinutes) / setMinutes
          : -($legTime - 30 - riseMinutes) / riseMinutes;

  onMount(() => {
    init();
  });
</script>

{#if typeof twilightOpacity === 'number'}
  <div
    class="sky"
    style={`opacity: ${twilightOpacity * 10}; --cloudCoverPercent: ${cloudCover / 100}`}
  >
    <div class="noite backdrop-blur-[100rem]"></div>
    <div class="nuvem">
      <Clouds />
    </div>
    <div class="constelacao"></div>

    <div class="lua">
      <div class="textura"></div>
    </div>
  </div>
{/if}
