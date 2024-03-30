import type { WeatherData } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

const weather: Writable<WeatherData> = writable();

export default weather;
