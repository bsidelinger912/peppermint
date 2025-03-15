import { Album, Song } from "@peppermint/shared";
import { TouchableOpacity, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AddToQueue from "~/components/svg/AddToQueue";
import { formatDuration } from "~/utils/formatting";
import { getInfoAsync } from "expo-file-system";
import { getFilePath } from "~/utils/files";
import { usePlayer } from "./player/PlayerContext";

type Props = {
  song: Song;
  album: Album;
  trackNumber: number;
};

export default function SongRow({ song, trackNumber, album }: Props) {
  const [isDownloaded, setIsDownloaded] = useState<boolean | undefined>();
  const { playNow } = usePlayer();

  function goToSong(songId: number) {
    router.push({
      pathname: "/song/[id]",
      params: { id: songId },
    });
  }

  async function checkIfDownloaded() {
    const fileInfo = await getInfoAsync(getFilePath(album, song));
    setIsDownloaded(Boolean(fileInfo));
  }

  useEffect(() => {
    checkIfDownloaded();
  }, []);

  return (
    <View key={song.id} className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity onPress={() => goToSong(song.id)}>
          <Text className="text-xl">
            {trackNumber}: {song.title}
          </Text>
        </TouchableOpacity>

        {isDownloaded && <Ionicons size={16} name="checkmark-circle" />}
      </View>

      <View className="flex flex-row items-center gap-3">
        <Text>{formatDuration(song.duration)}</Text>
        <TouchableOpacity onPress={() => playNow([song])}>
          <Ionicons name="play-circle" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AddToQueue size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
