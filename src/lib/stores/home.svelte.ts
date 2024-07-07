import type {
  CurrentWeatherData,
  GradientResult,
  HomeData,
  LocationType,
  NowPlayingData,
  WeatherData,
} from '$lib/types';

export const createHomeState = () => {
  let homeStore: HomeData = $state({
    location: {
      primary: true,
      name: 'Home',
      timeZone: 'America/New_York',
      latitude: 0,
      longitude: 0,
    },
    nowPlaying: {
      status: 'unknown',
      artist: '',
      album: '',
      art: '/missing-album-art.png',
      backgroundGradient: 'radial-gradient(at right top, darkblue, #1f1f1f)',
      foregroundGradient: 'radial-gradient(at right top, #FFFF74, #E0E0E0)',
      loved: false,
      relativeTimePosition: '00:00:00',
      title: '',
      totalTime: '00:00:00',
    },
  });

  return {
    nowPlaying: () => {
      return homeStore.nowPlaying;
    },

    nowPlayingArt: () => {
      return homeStore.nowPlaying.art;
    },

    nowPlayingGradients: (): GradientResult => {
      return {
        backgroundGradient: homeStore.nowPlaying.backgroundGradient,
        foregroundGradient: homeStore.nowPlaying.foregroundGradient,
      };
    },

    weather: () => {
      return homeStore.weather;
    },

    currentWeather: (): CurrentWeatherData | undefined => {
      const state = homeStore.weather?.current || undefined;
      return state;
    },

    currentRoundTemperature: (): CurrentWeatherData['temperature_2m'] => {
      const temp: number = homeStore?.weather?.current?.temperature_2m || 0;
      return Math.round(temp);
    },

    globalIsDay: async () => {
      const state =
        typeof homeStore.weather?.current?.is_day === 'number'
          ? homeStore.weather?.current?.is_day
          : undefined;
      return state;
    },

    locationName: () => {
      return homeStore.location.name;
    },

    locationTimeZone: () => {
      return homeStore.location.timeZone;
    },

    setLocation: async (location: LocationType) => {
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
    },

    setWeather: async (weather: WeatherData) => {
      homeStore = {
        ...homeStore,
        weather: {
          ...weather,
        },
      };
    },
  };
};

export const homeState = createHomeState();
