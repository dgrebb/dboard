import { writable, type Writable } from 'svelte/store';

const legTime: Writable<number> = writable();

export default legTime;
