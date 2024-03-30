<script lang="ts">
  import { onMount } from 'svelte';
  import { time } from '$lib/store';

  export let cloudLevel: number = 0;

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

  const rise = 7 * 60;
  $: beforeRise =
    $time > 1200 || $time < 240 ? 0.9999 : -($time - 240 - rise) / rise;

  onMount(() => {
    init();
  });
</script>

<!-- create by adriano.interaminense@gmail.com
full screen for better viewing -->

<div class="sky" style={`opacity: ${beforeRise}`}>
  <div class="noite"></div>

  <div class="constelacao"></div>

  <div class="lua">
    <div class="textura"></div>
  </div>
</div>
