import type { CurrentWeather } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const weather: Writable<CurrentWeather> = writable();
export const time: Writable<number> = writable();
