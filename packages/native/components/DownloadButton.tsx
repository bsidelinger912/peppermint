import { View, TouchableOpacity, Text } from "react-native";
import { Album, Song, Artist } from "@peppermint/shared";

import { useDownloadSongs } from "~/hooks/download";
import Icon from "~/components/ds/Icon";

type Props = {
  album: Album;
  songs: Song[];
  artists: Artist[];
};

export default function DownloadButton(props: Props) {
  const { loading, download, progress } = useDownloadSongs(props.album, props.songs, {
    onSuccess: () => {
      // console.log("success downloading");
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
        <Icon name="download-outline" size={28} />
      </View>
    </TouchableOpacity>
  );
}
