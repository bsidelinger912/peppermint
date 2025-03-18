import { TouchableOpacity } from "react-native";
import { usePlayer } from "./player/PlayerContext";
import { Album, Artist, Song } from "@peppermint/shared";
import AddToQueue from "./svg/AddToQueue";

type Props = {
  album: Album;
  artists: Artist[];
  songs: Song[];
};

export default function AddToQueueButton({ album, artists, songs }: Props) {
  const { addToQueue } = usePlayer();

  function add() {
    addToQueue(
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
    <TouchableOpacity onPress={add}>
      <AddToQueue size={28} />
    </TouchableOpacity>
  );
}
