<div class="current-music__modal__audio-animation audio">
  <div class="sound-icon disabled">
    <div class="sound-wave">
      <!-- Restoring original number of bars -->
      <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"
      ></i>
      <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"
      ></i>
      <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"
      ></i>
      <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"
      ></i>
      <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"
      ></i>
    </div>
  </div>
</div>

<style>
  .sound-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sound-wave {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
    height: 100px;
  }
  .bar {
    display: block;
    animation: sound linear infinite alternate;
    margin-right: 1px;
    border-radius: 3px;
    background: var(--bgColor);
    width: 3px;
    height: 20px; /* Initial height set here */
  }
  @keyframes sound {
    0%,
    100% {
      transform: scaleY(0.2);
      opacity: 0.33;
    }
    50% {
      transform: scaleY(1);
      opacity: 1;
    }
  }
  /* Adjusting durations to vary the animation slightly per bar */
  .bar:nth-child(odd) {
    animation-duration: 0.6s;
  }
  .bar:nth-child(even) {
    animation-duration: 0.8s;
  }
</style>
