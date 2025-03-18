import { createContext, useContext, useEffect, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Album, Artist, Song } from "@peppermint/shared";
import { getBestPlayableFile } from "./util";

interface PlayerContextType {
  playNow: (songs: SongAlbumAndArtists[]) => void;
  addToQueue: (songs: SongAlbumAndArtists[]) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (from: number, to: number) => void;
  queue: SongAlbumAndArtists[];
  currentIndex: number;
  currentSong: SongAlbumAndArtists | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  playPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setPosition: (position: number) => Promise<void>;
}

export type SongAlbumAndArtists = Song & {
  artists: Artist[];
  album: Album;
};

type ResolvedSongAlbumAndArtist = SongAlbumAndArtists & {
  fileUrl: string;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<ResolvedSongAlbumAndArtist[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const player = useAudioPlayer(queue[currentIndex]?.fileUrl);
  const { playing, currentTime, duration, isLoaded } = useAudioPlayerStatus(player);

  useEffect(() => {
    if (isLoaded && queue[currentIndex]) {
      player.play();
    }
  }, [isLoaded, queue[currentIndex]]);

  useEffect(() => {
    if (duration === currentTime && currentIndex + 1 < queue.length) {
      nextTrack();
    }
  }, [duration, currentTime, queue, currentIndex]);

  const playNow = async (songs: SongAlbumAndArtists[]) => {
    const resolvedSongs = await Promise.all(
      songs.map(async (song) => ({
        ...song,
        fileUrl: await getBestPlayableFile(song.album, song),
      }))
    );

    setQueue(resolvedSongs);
    setCurrentIndex(0);
  };

  const addToQueue = async (songs: SongAlbumAndArtists[]) => {
    const resolvedSongs = await Promise.all(
      songs.map(async (song) => ({
        ...song,
        fileUrl: await getBestPlayableFile(song.album, song),
      }))
    );

    setQueue((prev) => [...prev, ...resolvedSongs]);
  };

  const playPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const nextTrack = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      // The player will automatically load and play the new source
    }
  };

  const previousTrack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // The player will automatically load and play the new source
    }
  };

  const setPosition = async (position: number) => {
    await player.seekTo(position);
  };

  const moveQueueItem = (from: number, to: number) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      const [movedItem] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, movedItem);
      return newQueue;
    });

    // Adjust currentIndex if needed
    if (currentIndex === from) {
      setCurrentIndex(to);
    } else if (from < currentIndex && to >= currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    } else if (from > currentIndex && to <= currentIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);
      return newQueue;
    });

    // If we remove the current song, adjust currentIndex
    if (index === currentIndex) {
      // If there are songs after this one, keep same index to play next song
      // Otherwise move to previous song
      if (index >= queue.length - 1) {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    } else if (index < currentIndex) {
      // If we remove a song before the current one, decrement index
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        playNow,
        addToQueue,
        removeFromQueue,
        currentSong: queue[currentIndex] || null,
        isPlaying: playing,
        duration,
        position: currentTime,
        playPause,
        nextTrack,
        previousTrack,
        setPosition,
        moveQueueItem,
      }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
