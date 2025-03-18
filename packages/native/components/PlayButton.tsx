import { TouchableOpacity, View } from "react-native";
import Icon from "./ds/Icon";
import { usePlayer } from "./player/PlayerContext";
import { Album, Artist, Song } from "@peppermint/shared";

type Props = {
  album: Album;
  artists: Artist[];
  songs: Song[];
  variant: "large" | "small";
};

export default function PlayButton({ album, artists, songs, variant }: Props) {
  const { playNow } = usePlayer();

  function play() {
    playNow(
      songs.map((song) => {
        return {
          ...song,
          artists,
          album,
        };
      })
    );
  }

  return (
    <TouchableOpacity onPress={play}>
      {variant === "large" ? (
        <View className="items-center justify-center rounded-full border border-green-950 bg-green-700 p-2">
          <Icon name="play" color="#fff" size={32} style={{ position: "relative", left: 2 }} />
        </View>
      ) : (
        <Icon name="play-circle-outline" size={24} />
      )}
    </TouchableOpacity>
  );
}
