import { TransitionConfig } from 'svelte/transition';

interface TransitionParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  x?: number;
  y?: number;
  [key: string]: number | ((t: number) => number) | undefined;
}

interface TransitionAttribute {
  fn: (node: Element, params?: TransitionParams) => TransitionConfig;
  params?: TransitionParams;
}

declare module 'svelte/elements' {
  interface HTMLAttributes {
    transition?:
      | TransitionAttribute
      | ((node: Element, params?: TransitionParams) => TransitionConfig);
    in?: TransitionAttribute;
    out?: TransitionAttribute;
  }
}

declare module 'svelte/elements' {
  interface HTMLAttributes {
    transition?: TransitionAttribute;
    in?: TransitionAttribute;
    out?: TransitionAttribute;
  }
}
