<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import time from '$lib/stores/time';
  import solar from '$lib/stores/solar';

  export let cloudLevel: number = 0;

  const unsubscribe = solar.subscribe((value) => {
    console.log('🚀 ~ solar:', value);
  });

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

  // TODO: pull these actual times from the solar store
  const rise = 7 * 60;
  const set = 20 * 60;
  $: twilightTransition =
    $time < 240 || $time > 2200
      ? 0.9999
      : $time > 1140
        ? -($time - 240 - set) / set
        : -($time - 240 - rise) / rise;
  onMount(() => {
    init();
  });
  onDestroy(unsubscribe);
</script>

<!-- create by adriano.interaminense@gmail.com
full screen for better viewing -->

<div class="sky" style={`opacity: ${twilightTransition}`}>
  <div class="noite"></div>

  <div class="constelacao"></div>

  <div class="lua">
    <div class="textura"></div>
  </div>
</div>
