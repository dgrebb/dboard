import type { HomeData, NowPlayingData } from '$lib/types';

export const createHomeState = () => {
  let homeStore: HomeData = $state({
    nowPlaying: {
      artist: 'jo',
      title: 'mamo',
      art: 'http://localhost/album_art.png',
      album: 'iwhflagbherahsted',
      favorite: true,
    },
  });

  const setNowPlaying = (nowPlaying: NowPlayingData) => {
    homeStore = {
      ...homeStore,
      nowPlaying,
    };
  };

  const getNowPlaying = () => {
    return homeStore.nowPlaying;
  };

  return {
    get nowPlaying() {
      console.log('Getting the latest Track Information');
      return 'Sing for me';
    },
    setNowPlaying,
    getNowPlaying,
  };
};

export const homeState = createHomeState();
