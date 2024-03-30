import type { SolarData } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

const solar: Writable<SolarData> = writable();

export default solar;
