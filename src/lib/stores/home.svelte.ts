import type {
  HomeData,
  LocationData,
  NowPlayingData,
  WeatherData,
} from '$lib/types';

import { createGradientFromImage } from '$utils/colorThief';

const createGradient = async (image: string): Promise<string | boolean> => {
  let albumGradient: string | boolean = false;
  await createGradientFromImage(image)
    .then((gradient) => (albumGradient = gradient))
    .catch((error) => console.error(error));
  return albumGradient;
};

export const createHomeStore = () => {
  let homeStore: HomeData = $state({
    location: {
      primary: true,
      name: 'Home',
      timezone: 'America/New_York',
      latitude: 0,
      longitude: 0,
    },
    nowPlaying: {
      artist: '',
      title: '',
      art: '',
      gradient: 'radial-gradient(at right top, #686868, #1f1f1f)',
      album: '',
      loved: false,
    },
    weather: {
      success: false,
    },
  });

  return {
    nowPlaying: () => {
      return homeStore.nowPlaying;
    },

    nowPlayingArt: () => {
      return homeStore.nowPlaying.art;
    },

    albumGradient: (): string => {
      return homeStore.nowPlaying.gradient;
    },

    weather: () => {
      return homeStore.weather;
    },

    currentWeather: () => {
      return homeStore.weather.current;
    },

    locationName: () => {
      return homeStore.location.name;
    },

    setLocation: (location: LocationData) => {
      homeStore = {
        ...homeStore,
        location,
      };
    },

    setNowPlaying: async (nowPlaying: NowPlayingData) => {
      const gradient = await createGradient(homeStore.nowPlaying.art);
      if (typeof gradient === 'string') nowPlaying.gradient = gradient;
      homeStore = {
        ...homeStore,
        nowPlaying: {
          ...homeStore.nowPlaying,
          ...nowPlaying,
        },
      };
    },

    setWeather: (weather: WeatherData) => {
      homeStore = {
        ...homeStore,
        weather,
      };
    },
  };
};

export const homeState = createHomeStore();
