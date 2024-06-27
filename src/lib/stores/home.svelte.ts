import type {
  HomeData,
  LocationData,
  NowPlayingData,
  WeatherData,
} from '$lib/types';
import { timeStringToSeconds } from '$utils/strings';

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
      status: 'unknown',
      artist: '',
      album: '',
      art: '/missing-album-art.png',
      gradient: 'radial-gradient(at right top, darkblue, #1f1f1f)',
      loved: false,
      relativeTimePosition: '00:00:00',
      title: '',
      totalTime: '00:00:00',
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

    nowPlayingGradient: (): string => {
      return homeStore.nowPlaying.gradient;
    },

    nowPlayingTotalTime: (): number => {
      const time = timeStringToSeconds(homeStore.nowPlaying.totalTime);
      return time;
    },

    nowPlayingRelativeTimePosition: (): number => {
      const time = timeStringToSeconds(
        homeStore.nowPlaying.relativeTimePosition
      );
      return time;
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
      const state = {
        ...homeStore,
        nowPlaying: {
          ...homeStore.nowPlaying,
          ...nowPlaying,
        },
      };
      homeStore = state;
      // console.log('🚀 ~ setNowPlaying: ~ state:', state);
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
