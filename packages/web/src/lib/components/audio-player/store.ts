import { get, writable } from "svelte/store";

import type { PlaylistItem } from "./types";
import { browser } from "$app/environment";

const localStorageKey = "peppermint-playlist";
const playlistFromStorage = browser && localStorage.getItem(localStorageKey);
const initialPlaylist = playlistFromStorage ? (JSON.parse(playlistFromStorage) as PlaylistItem[]) : [];

export const playlist = writable<PlaylistItem[]>(initialPlaylist);
export const pastPlayed = writable<PlaylistItem[]>([]);
export const isPlaying = writable(false);

// persist playlist state to local storage any time it changes
playlist.subscribe((value) => {
  browser && localStorage.setItem(localStorageKey, JSON.stringify(value));
});

export function addToPlaylist(item: PlaylistItem) {
  playlist.update((current) => current.concat(item));
}

export function playNow(item: PlaylistItem) {
  playlist.update((current) => [item].concat(current));
  isPlaying.set(true);
}

export function playNext() {
  pastPlayed.update((current) => current.concat(get(playlist)[0]));
  playlist.update((current) => current.slice(1));
}
