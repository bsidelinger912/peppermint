import { createContext, useContext, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Song } from "@peppermint/shared";

interface PlayerContextType {
  playNow: (songs: Song[]) => void;
  addToQueue: (songs: Song[]) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  playPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const player = useAudioPlayer(queue[currentIndex]?.mp3);
  const { playing, currentTime, duration } = useAudioPlayerStatus(player);

  const playNow = (songs: Song[]) => {
    setQueue(songs);
    setCurrentIndex(0);
    // The player will automatically load and play the new source
  };

  const addToQueue = (songs: Song[]) => {
    setQueue((prev) => [...prev, ...songs]);
  };

  const playPause = async () => {
    if (player.playing) {
      await player.pause();
    } else {
      await player.play();
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

  return (
    <PlayerContext.Provider
      value={{
        playNow,
        addToQueue,
        currentSong: queue[currentIndex] || null,
        isPlaying: playing,
        duration,
        position: currentTime,
        playPause,
        nextTrack,
        previousTrack,
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
