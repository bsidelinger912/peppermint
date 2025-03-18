import { Album, Artist, Song } from "@peppermint/shared";
import { TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import AddToQueue from "~/components/svg/AddToQueue";
import { formatDuration } from "~/utils/formatting";
import { getInfoAsync } from "expo-file-system";
import { getFilePath } from "~/utils/files";
import { usePlayer } from "./player/PlayerContext";
import Typography from "./ds/Typography";
import Icon from "./ds/Icon";

type Props = {
  song: Song;
  album: Album;
  artists: Artist[];
  trackNumber: number;
};

export default function SongRow({ song, trackNumber, album, artists }: Props) {
  const [isDownloaded, setIsDownloaded] = useState<boolean | undefined>();
  const { playNow, addToQueue } = usePlayer();

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

  function playSong() {
    playNow([
      {
        ...song,
        artists,
        album,
      },
    ]);
  }

  function addSongToQueue() {
    addToQueue([
      {
        ...song,
        artists,
        album,
      },
    ]);
  }

  return (
    <View key={song.id} className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity onPress={() => goToSong(song.id)}>
          <Typography>
            {trackNumber}: {song.title}
          </Typography>
        </TouchableOpacity>

        {isDownloaded && <Icon size={16} name="checkmark-circle" />}
      </View>

      <View className="flex flex-row items-center gap-3">
        <Typography>{formatDuration(song.duration)}</Typography>
        <TouchableOpacity onPress={playSong}>
          <Icon name="play-circle" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={addSongToQueue}>
          <AddToQueue size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
