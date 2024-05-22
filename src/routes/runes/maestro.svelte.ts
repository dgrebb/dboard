import type { ComponentType } from 'svelte';
import { weather, background } from '$root/lib/stores/stores.svelte';

export type OvertureType = {
  id: number;
  name: string;
  component: ComponentType;
  props?: { [key: string]: unknown };
  tempo?: number;
};

export type ScoreType = OvertureType[];

export const conduct = async function conduct(
  latitude: string,
  longitude: string
) {
  weather.loadWeather(latitude, longitude);
  weather.setTempo(900000, latitude, longitude);
  background.updateColor(latitude, longitude);
  background.setTempo(900000, latitude, longitude);
  // TODO: loop over widgets and set up their API tempos
  // console.log('🎼 Conducting: ');
  // console.table(score);
  // score.forEach((overture: OvertureType) => {
  //   const { id, name, component, props, tempo } = overture;
  //   setInterval(() => {
  //     console.log(id, name, component, props);
  //   }, tempo);
  // });
};
