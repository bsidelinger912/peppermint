import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";

import { usePlayer } from "./PlayerContext";
import { formatDuration } from "~/utils/formatting";

export function Player() {
  const {
    queue,
    currentIndex,
    currentSong,
    isPlaying,
    duration,
    position,
    playPause,
    nextTrack,
    previousTrack,
    setPosition,
  } = usePlayer();

  function goToArtist(artistId: number) {
    router.push({
      pathname: "/artist/[id]",
      params: { id: artistId },
    });
  }

  function goToSong(songId: number) {
    router.push({
      pathname: "/song/[id]",
      params: { id: songId },
    });
  }

  if (!currentSong) return null;

  return (
    <View className="gap-1 p-3">
      <View className="flex flex-row items-center justify-between">
        <TouchableOpacity onPress={() => goToSong(currentSong.id)}>
          <Text className="text-xl font-semibold text-white" numberOfLines={1}>
            {currentSong.title}
          </Text>
        </TouchableOpacity>

        <View>
          {currentSong.artists.map((artist) => (
            <TouchableOpacity key={artist.id} onPress={() => goToArtist(artist.id)}>
              <Text className="text-white">{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex flex-row items-center justify-between">
        <Text className="text-sm text-white">{formatDuration(position)}</Text>
        <Slider
          style={{ width: "70%" }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={setPosition}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#888"
          thumbTintColor="#fff"
          tapToSeek={true}
        />
        <Text className="text-sm text-white">{formatDuration(duration)}</Text>
      </View>

      <View className="flex flex-row items-center justify-center gap-4">
        <TouchableOpacity disabled={currentIndex === 0} onPress={previousTrack}>
          <Ionicons name="play-skip-back" size={24} color={currentIndex === 0 ? "grey" : "white"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause}>
          <Ionicons name={isPlaying ? "pause" : "play-circle"} size={38} color="white" />
        </TouchableOpacity>

        <TouchableOpacity disabled={currentIndex + 1 >= queue.length} onPress={nextTrack}>
          <Ionicons
            name="play-skip-forward"
            size={24}
            color={currentIndex + 1 >= queue.length ? "grey" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
