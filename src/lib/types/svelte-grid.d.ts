declare module 'svelte-grid' {
  import type { SvelteComponentTyped } from 'svelte';

  export interface Size {
    w: number;
    h: number;
  }

  export interface Positon {
    x: number;
    y: number;
  }

  interface ItemLayout extends Size, Positon {
    fixed?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    customDragger?: boolean;
    customResizer?: boolean;
    min?: Size;
    max?: Size;
  }

  export type Item<T> = T & Record<number, ItemLayout>;
  export type FilledItem<T> = T & Record<number, Required<ItemLayout>>;

  export interface Props<T> {
    fillSpace?: boolean;
    items: FilledItem<T>[];
    rowHeight: number;
    cols: [number, number][];
    gap?: [number, number];
    fastStart?: boolean;
    throttleUpdate?: number;
    throttleResize?: number;

    scroller?: undefined;
    sensor?: number;
  }

  export interface Slots<T> {
    default: { item: ItemLayout; dataItem: Item<T> };
  }

  export default class Grid<T = object> extends SvelteComponentTyped<
    Props<T>,
    object,
    Slots<T>
  > {}
}

declare module 'svelte-grid/build/helper/index.mjs' {
  import { ItemLayout } from 'svelte-grid';

  const x: {
    normalize(items: unknown[], col: unknown): unknown[];
    adjust(items: unknown[], col: unknown): unknown[];
    findSpace(item: unknown, items: unknown, cols: unknown): object | unknown;

    item<>(obj: ItemLayout): Required<ItemLayout>;
  };

  export default x;
}
