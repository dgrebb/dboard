import { writable, type Writable } from 'svelte/store';

export const time: Writable<number> = writable();
