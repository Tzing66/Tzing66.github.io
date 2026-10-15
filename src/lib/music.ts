import { loadData } from "./data";

export type Track = {
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
  nowPlaying?: boolean;
  playedAt?: string | null;
};

export type MusicData = {
  fetchedAt: string;
  source: "spotify";
  profile: string;
  recent: Track[];
  topTracks: Track[];
  topArtists: { name: string; image: string | null; url: string }[];
};

const data = loadData<MusicData>("music");
/** Spotify snapshot from build time, or undefined (never fetched, or an old Last.fm file), in which case the card hides. */
export const music = data?.source === "spotify" && (data.recent?.length || data.topTracks?.length) ? data : undefined;
