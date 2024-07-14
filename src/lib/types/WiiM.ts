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
  loved: boolean;
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
  loved: boolean;
}

export interface PositionInfo {
  totalTime: string | null;
  relativeTimePosition: string | null;
}
