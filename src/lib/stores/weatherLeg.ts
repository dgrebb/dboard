import type { CurrentWeatherData } from '$types';
import { writable, type Writable } from 'svelte/store';

const weather: Writable<CurrentWeatherData> = writable();

export default weather;
