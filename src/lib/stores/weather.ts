import type { CurrentWeather } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

const weather: Writable<CurrentWeather> = writable();

export default weather;
