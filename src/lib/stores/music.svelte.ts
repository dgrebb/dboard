import type { GradientResult, NowPlayingData } from '$lib/types';

export const createMusicState = () => {
  let musicStore: NowPlayingData = $state({
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
  });

  return {
    nowPlaying: () => {
      return musicStore;
    },
    setNowPlaying: async (nowPlaying: NowPlayingData) => {
      musicStore = {
        ...musicStore,
        ...nowPlaying,
      };
    },

    nowPlayingArt: () => {
      return musicStore.art;
    },

    nowPlayingGradients: (): GradientResult => {
      return {
        backgroundGradient: musicStore.backgroundGradient,
        foregroundGradient: musicStore.foregroundGradient,
      };
    },

    setNowPlayingGradients: (gradients: GradientResult) => {
      musicStore = {
        ...musicStore,
        ...gradients,
      };
    },
  };
};

export const musicState = createMusicState();
