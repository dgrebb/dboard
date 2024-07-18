<script lang="ts">
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 512 512"
>
  <defs>
    <linearGradient id="DayClear_a" x1="150" x2="234" y1="119" y2="265">
      <stop offset="0" stop-color="#fbbf24" />
      <stop offset="1" stop-color="#f59e0b" />
    </linearGradient>
    <symbol id="DayClear_b" viewBox="0 0 384 384">
      <circle
        cx="192"
        cy="192"
        r="84"
        fill="url(#DayClear_a)"
        stroke="#f8af18"
        stroke-miterlimit="10"
        stroke-width="6"
      />
      <path
        fill="none"
        stroke="#fbbf24"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="24"
        d="M192 61V12m0 360v-50m92-223l35-35M65 319l35-35m0-184-35-35m255 255-35-35M62 192H12m360 0h-50"
      >
        <animateTransform
          additive="sum"
          attributeName="transform"
          dur="12s"
          repeatCount="indefinite"
          type="rotate"
          values="0 192 192; 45 192 192"
        />
      </path>
    </symbol>
  </defs>
  <use
    xlink:href="#DayClear_b"
    width="384"
    height="384"
    transform="translate(64 64)"
  />
</svg>
