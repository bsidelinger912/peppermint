import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Album, Song } from "@peppermint/shared";

import { useDownloadSongs } from "~/hooks/download";

type Props = {
  album: Album;
  songs: Song[];
};

export function AlbumDownloadButton(props: Props) {
  const { loading, download, progress } = useDownloadSongs(props.album, props.songs, {
    onSuccess: () => {
      console.log("success downloading");
    },
  });

  if (loading) {
    return (
      <View>
        <Text>Downloading {Math.round(progress * 100)}%...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={download}>
      <View>
        <Ionicons name="download-outline" size={28} />
      </View>
    </TouchableOpacity>
  );
}
