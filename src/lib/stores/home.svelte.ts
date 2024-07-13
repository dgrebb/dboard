import type {
  CurrentWeatherData,
  HomeData,
  LocationType,
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
    weather: undefined,
  });

  return {
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
