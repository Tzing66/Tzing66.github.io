import { loadData } from "./data";

export type Track = {
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
  nowPlaying: boolean;
  playedAt: string | null;
};

export type MusicData = {
  fetchedAt: string;
  source: "lastfm";
  profile: string;
  recent: Track[];
  topTracks: { title: string; artist: string; plays: number; url: string }[];
  topArtists: { name: string; plays: number; url: string }[];
};

const data = loadData<MusicData>("music");
/** Listening data, or undefined when never fetched / empty, in which case the card hides. */
export const music = data && (data.recent?.length || data.topTracks?.length) ? data : undefined;
