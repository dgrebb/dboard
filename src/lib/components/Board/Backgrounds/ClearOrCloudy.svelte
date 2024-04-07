<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import time from '$lib/stores/time';
  import weather from '$lib/stores/weather';
  import solar from '$lib/stores/solar';
  import Clouds from './Clouds.svelte';

  export let cloudCover: number = 0;
  let twilightTransition: number;
  let riseMinutes = 7 * 60;
  let setMinutes = 19 * 60;

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
    var qtdeEstrelas = 250;
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

  $: console.log('🚀 ~ onMount ~ $solar:', $solar);
  $: rise = new Date($solar?.sunrise[0]) || false;
  $: set = new Date($solar?.sunset[0]) || false;
  if (rise && set) {
    riseMinutes = rise.getHours() * 60 + rise.getMinutes();
    setMinutes = set.getHours() * 60 + set.getMinutes();
  }
  if ($weather) {
    cloudCover = $weather.cloud_cover;
  }

  $: twilightTransition =
    $time < riseMinutes - 60 || $time > setMinutes + 30
      ? 0.9999
      : $time > riseMinutes && $time < setMinutes
        ? 0.0
        : $time > 1140
          ? -($time + 60 - setMinutes) / setMinutes
          : -($time - 30 - riseMinutes) / riseMinutes;

  // DEBUG
  // console.log('🚀 ~ onMount ~ twilightTransition:', twilightTransition);
  // console.log('🚀 ~ onMount ~ riseMinutes:', rise, riseMinutes);
  // console.log('🚀 ~ onMount ~ setMinutes:', set, setMinutes);

  onMount(() => {
    init();
  });
</script>

<!-- create by adriano.interaminense@gmail.com
full screen for better viewing -->

{#if typeof twilightTransition === 'number'}
  <div
    class="sky"
    style={`opacity: ${twilightTransition * 10}; --cloudCoverPercent: ${cloudCover / 100}`}
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
