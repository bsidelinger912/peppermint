import { createContext, useContext, useEffect, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Album, Artist, Song } from "@peppermint/shared";
import { getBestPlayableFile } from "./util";

interface PlayerContextType {
  playNow: (songs: SongAlbumAndArtists[]) => void;
  addToQueue: (songs: SongAlbumAndArtists[]) => void;
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

type SongAlbumAndArtists = Song & {
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

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        playNow,
        addToQueue,
        currentSong: queue[currentIndex] || null,
        isPlaying: playing,
        duration,
        position: currentTime,
        playPause,
        nextTrack,
        previousTrack,
        setPosition,
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
