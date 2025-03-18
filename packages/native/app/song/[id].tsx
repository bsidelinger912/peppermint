import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Album, Artist, Song } from "@peppermint/shared";
import { router } from "expo-router";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
import Hero from "~/components/layout/hero/Hero";
import PlayerScreen from "~/components/layout/PlayerScreen";
import PlayButton from "~/components/PlayButton";
import AddToQueueButton from "~/components/AddToQueueButton";
import DownloadButton from "~/components/DownloadButton";
import Typography from "~/components/ds/Typography";

type SongWithAlbumsAndArtist = Song & {
  song_to_album: { album: Album }[];
  artist_to_song: { artist: Artist }[];
};

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();

  const { data: song } = queryOne<SongWithAlbumsAndArtist>(
    async () =>
      await supabase
        .from("song")
        .select(
          "*, song_to_album(album_id, album(*), track_number), artist_to_song(artist_id, artist(*))"
        )
        .eq("id", id)
        .single(),
    [{ table: "song", filter: `id=eq.${id}` }]
  );

  function goToArtist(artistId: number) {
    router.push({
      pathname: "/artist/[id]",
      params: { id: artistId },
    });
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlayerScreen>
        <Hero title={song?.title} image={song ? song.song_to_album[0].album.image : ""}>
          <View className="absolute bottom-0 left-2 gap-1">
            <Text className="text-4xl font-semibold text-white">{song?.title}</Text>
            <View>
              {song &&
                song?.artist_to_song.map(({ artist }) => (
                  <TouchableOpacity key={artist.id} onPress={() => goToArtist(artist.id)}>
                    <Text className="text-lg font-semibold text-white">{artist.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </Hero>

        {song && (
          <View className="flex flex-col gap-6 p-4" style={{ paddingBottom: bottom }}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-3">
                <PlayButton
                  variant="large"
                  songs={[song]}
                  album={song.song_to_album[0].album}
                  artists={song.artist_to_song.map(({ artist }) => artist)}
                />
                <AddToQueueButton
                  songs={[song]}
                  album={song.song_to_album[0].album}
                  artists={song.artist_to_song.map(({ artist }) => artist)}
                />
              </View>

              <DownloadButton
                songs={[song]}
                album={song.song_to_album[0].album}
                artists={song.artist_to_song.map(({ artist }) => artist)}
              />
            </View>

            {song.description && <Typography>{song.description}</Typography>}

            {song.lyrics && (
              <View className="flex gap-3">
                <Typography variant="h4">Lyrics</Typography>
                <Typography>{song.lyrics}</Typography>
              </View>
            )}
          </View>
        )}
      </PlayerScreen>
    </>
  );
}
