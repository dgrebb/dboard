<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 512 512"
>
  <defs>
    <linearGradient
      id="NightRain_a"
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
      id="NightRain_b"
      x1="53"
      x2="133"
      y1="10"
      y2="149"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#9ca3af" />
      <stop offset="1" stop-color="#6b7280" />
    </linearGradient>
    <linearGradient
      id="NightRain_c"
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
    <symbol id="NightRain_g" viewBox="0 0 200.3 126.1">
      <path
        fill="url(#NightRain_b)"
        stroke="#848b98"
        stroke-miterlimit="10"
        d="M.5 93a32 32 0 0032 32h130v-.1a35 35 0 006.5-69 32 32 0 00-48.5-33 49 49 0 00-88.6 37h-1.5A32 32 0 00.5 93Z"
      />
    </symbol>
    <symbol id="NightRain_h" viewBox="0 0 350 222">
      <path
        fill="url(#NightRain_a)"
        stroke="#e6effc"
        stroke-miterlimit="10"
        stroke-width="6"
        d="m291 107-2.5.1A84 84 0 00136 43a56 56 0 00-84 48 60 60 0 001 9A60 60 0 0063 219l4-.2v.2h224a56 56 0 000-112Z"
      />
    </symbol>
    <symbol id="NightRain_f" overflow="visible" viewBox="0 0 398 222">
      <use
        xlink:href="#NightRain_g"
        width="200.3"
        height="126.1"
        transform="translate(198 27)"
      >
        <animateTransform
          additive="sum"
          attributeName="transform"
          dur="12s"
          repeatCount="indefinite"
          type="translate"
          values="-9 0; 9 0; -9 0"
        />
      </use>
      <use xlink:href="#NightRain_h" width="350" height="222">
        <animateTransform
          additive="sum"
          attributeName="transform"
          dur="12s"
          repeatCount="indefinite"
          type="translate"
          values="-18 0; 18 0; -18 0"
        />
      </use>
    </symbol>
    <symbol id="NightRain_i" overflow="visible" viewBox="0 0 129 57">
      <path
        fill="url(#NightRain_c)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M8 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="NightRain_x1"
          additive="sum"
          attributeName="transform"
          begin="0s; x1.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="NightRain_y1"
          attributeName="opacity"
          begin="0s; y1.end+1s"
          dur="1s"
          keyTimes="0; .25; 1"
          values="0; 1; 0"
        />
      </path>
      <path
        fill="url(#NightRain_d)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M64 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="NightRain_x2"
          additive="sum"
          attributeName="transform"
          begin="1s; x2.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="NightRain_y2"
          attributeName="opacity"
          begin="1s; y2.end+1s"
          dur="1s"
          keyTimes="0; .25; 1"
          values="0; 1; 0"
        />
      </path>
      <path
        fill="url(#NightRain_e)"
        stroke="#0a5ad4"
        stroke-miterlimit="10"
        d="M120 56a8 8 0 01-8-8v-40a8 8 0 0116 0v40a8 8 0 01-8 8Z"
        opacity="0"
      >
        <animateTransform
          id="NightRain_x3"
          additive="sum"
          attributeName="transform"
          begin="-1s; x3.end+1s"
          dur="1s"
          type="translate"
          values="0 -60; 0 60"
        />
        <animate
          id="NightRain_y3"
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
    xlink:href="#NightRain_f"
    width="398"
    height="222"
    transform="translate(68.84 145)"
  />
  <use
    xlink:href="#NightRain_i"
    width="129"
    height="57"
    transform="translate(191.5 343.5)"
  />
</svg>
