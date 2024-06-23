import type {
  HomeData,
  LocationData,
  NowPlayingData,
  WeatherData,
} from '$lib/types';

import { colorThief } from '$utils/colorThief';

const createGradient = async (image: string): Promise<string | false> => {
  if (typeof image !== 'string') return false;
  let albumGradient: string | boolean = false;
  await colorThief(image)
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
      art: '/data/AirplayArtWorkData.png',
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
      const delay = 3333;
      const stolenColors = await createGradient(nowPlaying.art);
      const gradient = stolenColors || nowPlaying.previousGradient;
      const state = {
        ...homeStore,
        nowPlaying: {
          ...homeStore.nowPlaying,
          ...nowPlaying,
          ...(typeof gradient === 'string' ? { nextGradient: gradient } : {}),
        },
      };
      homeStore = state;
      setTimeout(async () => {
        homeStore.nowPlaying.previousGradient = gradient;
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
