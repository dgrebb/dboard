<script lang="ts">
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 512 512"
>
  <defs>
    <linearGradient id="DayOvercast_a" x1="100" x2="230" y1="30" y2="260">
      <stop offset="0" stop-color="#f3f7fe" />
      <stop offset="1" stop-color="#deeafb" />
    </linearGradient>
    <linearGradient id="DayOvercast_b" x1="52.7" x2="133.4" y1="9.6" y2="149.3">
      <stop offset="0" stop-color="#9ca3af" />
      <stop offset="1" stop-color="#6b7280" />
    </linearGradient>
    <linearGradient id="DayOvercast_c" x1="78" x2="118" y1="63.4" y2="132.7">
      <stop offset="0" stop-color="#fbbf24" />
      <stop offset="1" stop-color="#f59e0b" />
    </linearGradient>
    <symbol id="DayOvercast_e" viewBox="0 0 196 196">
      <circle
        cx="98"
        cy="98"
        r="40"
        fill="url(#DayOvercast_c)"
        stroke="#f8af18"
        stroke-miterlimit="10"
        stroke-width="4"
      />
      <path
        fill="none"
        stroke="#fbbf24"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="12"
        d="M98 31V6m0 184v-25M145 51l18-18M33 163l18-18M51 51 33 33m130 130-18-18M6 98h25M190 98h-25"
      >
        <animateTransform
          additive="sum"
          attributeName="transform"
          dur="12s"
          repeatCount="indefinite"
          type="rotate"
          values="0 98 98; 45 98 98"
        />
      </path>
    </symbol>
    <symbol id="DayOvercast_g" viewBox="0 0 200.3 126.1">
      <path
        fill="url(#DayOvercast_b)"
        stroke="#848b98"
        stroke-miterlimit="10"
        d="M.5 93.2a32.4 32.4 0 0032.4 32.4h129.8v-.1l2.3.1a34.8 34.8 0 006.5-68.9 32.4 32.4 0 00-48.5-33 48.6 48.6 0 00-88.6 37.1h-1.5A32.4 32.4 0 00.5 93.1Z"
      />
    </symbol>
    <symbol id="DayOvercast_h" viewBox="0 0 350 222">
      <path
        fill="url(#DayOvercast_a)"
        stroke="#e6effc"
        stroke-miterlimit="10"
        stroke-width="6"
        d="m291 107-2.5.1A83.9 83.9 0 00135.6 43 56 56 0 0051 91a56.6 56.6 0 00.8 9A60 60 0 0063 219l4-.2v.2h224a56 56 0 000-112Z"
      />
    </symbol>
    <symbol id="DayOvercast_f" overflow="visible" viewBox="0 0 398 222">
      <use
        xlink:href="#DayOvercast_g"
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
      <use xlink:href="#DayOvercast_h" width="350" height="222">
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
    <symbol id="DayOvercast_d" overflow="visible" viewBox="0 0 410.8 258">
      <use xlink:href="#DayOvercast_e" width="196" height="196" />
      <use
        xlink:href="#DayOvercast_f"
        width="398"
        height="222"
        transform="translate(12.84 36)"
      />
    </symbol>
  </defs>
  <use
    xlink:href="#DayOvercast_d"
    width="410.8"
    height="258"
    transform="translate(56 109)"
  />
</svg>
