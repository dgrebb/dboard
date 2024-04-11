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
    left: 50%;
    top: 3rem;
  }
  .audio span {
    width: 10px;
    height: 20px;
    background: white;
    background-blend-mode: overlay;
    border-radius: 2px;
    position: absolute;
    bottom: 0;
  }
  .audio span:first-of-type {
    margin-top: 0;
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
    0% {
      height: 2px;
    }
    50% {
      height: 20px;
    }
    100% {
      height: 2px;
    }
  }
</style>
