<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import time from '$lib/stores/time';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';
  import Clouds from './Clouds.svelte';

  export let cloudCover: number = 0;
  let twilightTransition: number;

  function init() {
    //estrelas

    var style = ['style1', 'style2', 'style3', 'style4'];
    var tam = ['tam1', 'tam1', 'tam1', 'tam2', 'tam3'];
    var opacity = [
      'opacity1',
      'opacity1',
      'opacity1',
      'opacity2',
      'opacity2',
      'opacity3',
    ];

    function getRandomArbitrary(min: number, max: number) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    var estrela = '';
    var qtdeEstrelas = 2050;
    var noite: HTMLElement | null = document.querySelector('.constelacao');
    var widthWindow = window.innerWidth * 2;
    var heightWindow = window.innerHeight * 2;

    for (var i = 0; i < qtdeEstrelas; i++) {
      estrela +=
        "<span class='estrela " +
        style[getRandomArbitrary(0, 4)] +
        ' ' +
        opacity[getRandomArbitrary(0, 6)] +
        ' ' +
        tam[getRandomArbitrary(0, 5)] +
        "' style='animation-delay: ." +
        getRandomArbitrary(0, 9) +
        's; left: ' +
        getRandomArbitrary(0, widthWindow) +
        'px; top: ' +
        getRandomArbitrary(0, heightWindow) +
        "px;'></span>";
    }

    noite ? (noite.innerHTML = estrela) : null;
  }

  onMount(() => {
    let riseMinutes = 7 * 60;
    let setMinutes = 19 * 60;
    const rise = new Date($solar?.sunrise[0]) || null;
    const set = new Date($solar?.sunset[0]) || null;
    if (rise && set) {
      riseMinutes = rise.getHours() * 60 + rise.getMinutes();
      console.log('🚀 ~ onMount ~ riseMinutes:', riseMinutes);
      setMinutes = set.getHours() * 60 + set.getMinutes();
      console.log('🚀 ~ onMount ~ setMinutes:', setMinutes);
    }
    if ($weather) {
      cloudCover = $weather.cloud_cover;
    }
    twilightTransition =
      $time < riseMinutes - 60 || $time > setMinutes + 30
        ? 0.9999 // night
        : $time > riseMinutes && $time < setMinutes // day
          ? 0.0
          : $time > 1140 // rising or setting sun
            ? -($time + 60 - setMinutes) / setMinutes
            : -($time - 30 - riseMinutes) / riseMinutes;
    init();
  });
</script>

<!-- create by adriano.interaminense@gmail.com
full screen for better viewing -->

<div
  class="sky"
  style={`opacity: ${twilightTransition * 10}; --cloudCoverPercent: ${cloudCover / 100}`}
>
  <div class="noite"></div>
  <div class="nuvem">
    <Clouds />
  </div>
  <div class="constelacao"></div>

  <div class="lua">
    <div class="textura"></div>
  </div>
</div>
