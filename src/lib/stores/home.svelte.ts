import type { HomeData, NowPlayingData, WeatherData } from '$lib/types';

export const createHomeState = () => {
  let homeStore: HomeData = $state({
    nowPlaying: {
      artist: '',
      title: '',
      art: 'http://localhost/album_art.png',
      album: '',
      loved: false,
    },
    weather: {
      success: false,
    },
  });

  const setNowPlaying = (nowPlaying: NowPlayingData) => {
    homeStore = {
      ...homeStore,
      nowPlaying: {
        ...homeStore.nowPlaying,
        ...nowPlaying,
      },
    };
  };

  const setWeather = (weather: WeatherData) => {
    homeStore = {
      ...homeStore,
      weather,
    };
  };

  return {
    nowPlaying: () => {
      return homeStore.nowPlaying;
    },
    setNowPlaying,
    getNowPlaying: () => {
      return homeStore.nowPlaying;
    },
    getWeather: () => {
      return homeStore.weather;
    },
    getCurrentWeather: () => {
      return homeStore.weather.current;
    },
    setWeather,
  };
};

export const homeState = createHomeState();
