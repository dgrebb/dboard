import { writable, type Writable } from 'svelte/store';

const time: Writable<number> = writable();

export default time;
