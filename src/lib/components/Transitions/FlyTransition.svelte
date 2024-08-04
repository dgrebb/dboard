<script lang="ts">
  /**
   * Svelte component for handling transitions with an elastic fly-out effect.
   * @module TransitionElasticFly
   * @param {string} transitionKey - The key to trigger transitions.
   * @param {boolean} classList - Additional class names for the container.
   * @param {number} duration - Duration of the fly-out transition in milliseconds.
   * @param {number} delay - Delay before the fly-in transition starts in milliseconds.
   */
  import type { Snippet } from 'svelte';
  import { circInOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import './transitions.css';

  interface Props {
    transitionKey: unknown;
    classList?: false | string;
    duration?: number;
    delay?: number;
    children: Snippet;
    direction: 'forward' | 'backward';
  }

  let {
    transitionKey,
    classList = false,
    duration = 222,
    delay = 222,
    children,
    direction,
  }: Props = $props();
</script>

{#key transitionKey}
  <!--
   Container for the elastic fly-out transition.
   @type {HTMLDivElement}
   -->
  <!-- on:outrostart={animateOut} -->
  <!-- on:introstart={animateIn} -->
  <div
    class="fly-transition-wrapper {classList ? classList : ''}"
    out:fly|global={{
      x: `${direction === 'forward' ? -500 : 500}`,
      duration,
      easing: circInOut,
    }}
    in:fly|global={{
      x: `${direction === 'forward' ? 500 : -500}`,
      duration,
      delay,
      easing: circInOut,
    }}
  >
    {@render children()}
  </div>
{/key}
