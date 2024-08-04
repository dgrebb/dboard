/**
 * Type representing music data.
 */
export interface MusicData {
  album: string;
  artist: string;
  title: string;
  loved: boolean;
}

/**
 * WiiM API interface.
 */
export interface NowPlayingAPI {
  album: string;
  artist: string;
  title: string;
  art: string;
  totalTime: string;
  relativeTimePosition: string;
}

export interface MediaInfo {
  nrTracks: string | null;
  mediaDuration: string | null;
  currentURI: string | null;
  currentURIMetaData: string | null;
  nextURI: string | null;
  nextURIMetaData: string | null;
  trackSource: string | null;
  playMedium: string | null;
  recordMedium: string | null;
  writeStatus: string | null;
}

export interface PositionInfo {
  totalTime: string | null;
  relativeTimePosition: string | null;
}

/**
 * Type representing now playing data.
 */
export interface NowPlayingData {
  status?: string;
  artist: string;
  album: string;
  art: string;
  backgroundGradient: string;
  foregroundGradient: string;
  loved: boolean;
  relativeTimePosition: string;
  title: string;
  totalTime: string;
}

export interface GradientResult {
  backgroundGradient: string;
  foregroundGradient: string;
}
