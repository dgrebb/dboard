import type {
  HomeData,
  LocationData,
  NowPlayingData,
  WeatherData,
} from '$lib/types';

import { colorThief } from '$utils/colorThief';

const createGradient = async (image: string): Promise<string | boolean> => {
  let albumGradient: string | boolean = false;
  if (image !== '') {
    await colorThief(image)
      .then((gradient) => (albumGradient = gradient))
      .catch((error) => console.error(error));
  }
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
      previousGradient: 'radial-gradient(at right top, darkblue, #1f1f1f)',
      nextGradient: 'radial-gradient(at right top, #686868, #1f1f1f)',
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

    albumGradients: (): { [key: string]: string } => {
      return {
        previousGradient: homeStore.nowPlaying.previousGradient,
        nextGradient: homeStore.nowPlaying.nextGradient,
      };
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
      const gradient = await createGradient(nowPlaying.art);
      const delay = 3333;
      if (typeof gradient === 'string') nowPlaying.nextGradient = gradient;
      homeStore = {
        ...homeStore,
        nowPlaying: {
          ...homeStore.nowPlaying,
          ...nowPlaying,
        },
      };
      setTimeout(() => {
        homeStore.nowPlaying.previousGradient =
          homeStore.nowPlaying.nextGradient;
      }, delay);
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
