import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "./PlayerContext";
import { formatDuration } from "~/utils/formatting";

export function Player() {
  const { currentSong, isPlaying, duration, position, playPause, nextTrack, previousTrack } =
    usePlayer();

  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatDuration(position)}</Text>
          <Text style={styles.time}>{formatDuration(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={previousTrack}>
          <Ionicons name="play-skip-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={nextTrack}>
          <Ionicons name="play-skip-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  content: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
});
