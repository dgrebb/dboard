import type {
  HomeData,
  LocationData,
  NowPlayingData,
  WeatherData,
} from '$lib/types';

import { createGradientFromImage } from '$utils/colorThief';

const createGradient = async (image: string): Promise<string> => {
  const gradient = await createGradientFromImage(image);
  return gradient;
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

    albumGradient: () => {
      const art = homeStore.nowPlaying.art;
      if (art === '') return '';
      const albumGradient = createGradient(homeStore.nowPlaying.art);
      return albumGradient;
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

    setNowPlaying: (nowPlaying: NowPlayingData) => {
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
