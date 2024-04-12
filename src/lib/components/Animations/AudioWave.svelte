<div class="current-music__modal__audio-animation audio">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>

<style>
  .audio {
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    position: relative; /* Ensure the absolute positioning of children is relative to this element */
  }
  .audio span {
    width: 10px;
    background: white;
    border-radius: 2px;
    position: absolute;
    bottom: 0;
    transform-origin: bottom;
    will-change: transform; /* Optimized for GPU rendering */
  }
  .audio span:nth-child(1) {
    animation: animationTest 1.2s infinite ease-in-out;
    left: 0;
  }
  .audio span:nth-child(2) {
    animation: animationTest 1.6s infinite ease-in-out;
    left: 12px;
  }
  .audio span:nth-child(3) {
    animation: animationTest 1.4s infinite ease-in-out;
    left: 24px;
  }
  .audio span:nth-child(4) {
    animation: animationTest 1s infinite ease-in-out;
    left: 36px;
  }
  @keyframes animationTest {
    0%,
    100% {
      transform: scaleY(0.1);
    }
    50% {
      transform: scaleY(1);
    }
  }
</style>
