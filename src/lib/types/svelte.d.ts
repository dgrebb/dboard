import { TransitionConfig } from 'svelte/transition';

type TransitionParams = {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  x?: number;
  y?: number;
  [key: string]: number | ((t: number) => number) | undefined;
};

type TransitionAttribute = {
  fn: (node: Element, params: TransitionParams) => TransitionConfig;
  params?: TransitionParams;
};

declare module 'svelte/elements' {
  interface HTMLAttributes {
    transition?: TransitionAttribute;
    in?: TransitionAttribute;
    out?: TransitionAttribute;
  }
}
