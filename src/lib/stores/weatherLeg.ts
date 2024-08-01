import type { CurrentWeatherData } from '@types';
import { writable, type Writable } from 'svelte/store';

const weatherLeg: Writable<CurrentWeatherData> = writable();

export default weatherLeg;
