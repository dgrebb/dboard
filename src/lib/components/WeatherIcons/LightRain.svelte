<script lang="ts">
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 512 512"
>
  <defs>
    <linearGradient
      id="LightRain_a"
      x1="100"
      x2="233"
      y1="31"
      y2="261"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#f3f7fe" />
      <stop offset="1" stop-color="#deeafb" />
    </linearGradient>
    <linearGradient
      id="LightRain_b"
      x1="1381"
      x2="1399"
      y1="-1145"
      y2="-1097"
      gradientTransform="rotate(-9 8003 8233)"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#0b65ed" />
      <stop offset="1" stop-color="#0950bc" />
    </linearGradient>
    <linearGradient
      xlink:href="#LightRain_b"
      id="LightRain_c"
      x1="1437"
      x2="1455"
      y1="-1137"
      y2="-1090"
      gradientTransform="rotate(-9 8010 8233)"
    />
    <linearGradient
      xlink:href="#LightRain_b"
      id="LightRain_d"
      x1="1492"
      x2="1510"
      y1="-1129"
      y2="-1082"
      gradientTransform="rotate(-9 8017 8233)"
    />
    <symbol id="LightRain_e" viewBox="0 0 350 222">
      <path
        fill="url(#LightRain_a)"
        stroke="#e6effc"
        stroke-miterlimit="10"
        stroke-width="6"
        d="m291 107-2.5.1A84 84 0 00136 43a56 56 0 00-85 48 60 60 0 001 9 60 60 0 0012 121h224a56 56 0 000-112Z"
      />
    </symbol>
    <symbol id="LightRain_f" overflow="visible" viewBox="0 0 129 57">
      <path
        fill="url(#LightRain_b)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M8 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="LightRain_x1"
          additive="sum"
          attributeName="transform"
          begin="0s; x1.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="LightRain_y1"
          attributeName="opacity"
          begin="0s; y1.end+1s"
          dur="1s"
          keyTimes="0; .25; 1"
          values="0; 1; 0"
        />
      </path>
      <path
        fill="url(#LightRain_c)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M64 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="LightRain_x2"
          additive="sum"
          attributeName="transform"
          begin="1s; x2.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="LightRain_y2"
          attributeName="opacity"
          begin="1s; y2.end+1s"
          dur="1s"
          keyTimes="0; .25; 1"
          values="0; 1; 0"
        />
      </path>
      <path
        fill="url(#LightRain_d)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M120 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="LightRain_x3"
          additive="sum"
          attributeName="transform"
          begin="-1s; x3.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="LightRain_y3"
          attributeName="opacity"
          begin="-1s; y3.end+1s"
          dur="1s"
          keyTimes="0; .25; 1"
          values="0; 1; 0"
        />
      </path>
    </symbol>
  </defs>
  <use
    xlink:href="#LightRain_e"
    width="364"
    height="222"
    transform="translate(81 145)"
  />
  <use
    xlink:href="#LightRain_f"
    width="129"
    height="57"
    transform="translate(191.5 343.5)"
  />
</svg>
