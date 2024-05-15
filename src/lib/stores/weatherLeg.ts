import type { CurrentWeatherType } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

const weather: Writable<CurrentWeatherType> = writable();

export default weather;
