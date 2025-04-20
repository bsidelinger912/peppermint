import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Album, Song, Artist } from "@peppermint/shared";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
import ScreenLoader from "~/components/ScreenLoader";
import Hero from "~/components/layout/hero/Hero";
import { formatDuration } from "~/utils/formatting";
import DownloadButton from "~/components/DownloadButton";
import SongRow from "~/components/SongRow";
import PlayerScreen from "~/components/layout/PlayerScreen";
import PlayButton from "~/components/PlayButton";
import Typography from "~/components/ds/Typography";
import AddToQueueButton from "~/components/AddToQueueButton";

type QueryResult = Album & {
  song_to_album: {
    song: Song;
    track_number: number;
  }[];
  artist_to_album: {
    artist: Artist;
  }[];
};

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();

  const { data: album } = queryOne<QueryResult>(
    async () =>
      await supabase
        .from("album")
        .select(
          "*, song_to_album(song_id, song(*), track_number), artist_to_album(artist_id, artist(*))"
        )
        .eq("id", id)
        .single(),
    [{ table: "album", filter: `id=eq.${id}` }]
  );

  const sortedSongs = album?.song_to_album
    .map(({ song, track_number }) => ({
      ...song,
      track_number,
    }))
    .sort((a, b) => a.track_number - b.track_number);

  function goToArtist(artistId: number) {
    router.push({
      pathname: "/artist/[id]",
      params: { id: artistId },
    });
  }

  const releaseDate = album?.release_date ? new Date(album.release_date).getFullYear() : "";
  const totalDuration =
    album?.song_to_album && album.song_to_album.length > 0
      ? album.song_to_album.reduce((acc, { song }) => acc + (song.duration || 0), 0)
      : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlayerScreen>
        <Hero image={album?.image || ""} title={album?.name}>
          {album && (
            <View className="absolute bottom-0 left-2 flex gap-3">
              <Text className="text-4xl font-semibold text-white">{album.name}</Text>
              <View className="flex flex-col gap-1">
                <View className="flex flex-row">
                  {album &&
                    album.artist_to_album.map(({ artist }) => (
                      <TouchableOpacity key={artist.id} onPress={() => goToArtist(artist.id)}>
                        <Text className="text-lg font-semibold text-white">{artist.name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-white">{releaseDate}</Text>
                  <Text className="text-white">•</Text>
                  <Text className="text-white">
                    {album?.song_to_album.length} songs, {formatDuration(totalDuration, "long")}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Hero>

        {album ? (
          <View className="flex flex-col gap-6 p-4" style={{ paddingBottom: bottom }}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-3">
                <PlayButton
                  variant="large"
                  album={album}
                  artists={album.artist_to_album.map(({ artist }) => artist)}
                  songs={sortedSongs as Song[]}
                />
                <AddToQueueButton
                  album={album}
                  artists={album.artist_to_album.map(({ artist }) => artist)}
                  songs={album.song_to_album.map(({ song }) => song)}
                />
              </View>

              <DownloadButton
                album={album}
                artists={album.artist_to_album.map(({ artist }) => artist)}
                songs={album.song_to_album.map(({ song }) => song)}
              />
            </View>
            {album.description && (
              <View className="flex flex-col gap-3">
                <Typography variant="h3">From the artist:</Typography>
                <Typography>{album.description}</Typography>
              </View>
            )}

            <View className="w-full border border-slate-400" />

            <View className="flex flex-col gap-3">
              <Typography variant="h3">Songs</Typography>
            </View>

            <View className="gap-4">
              {sortedSongs &&
                sortedSongs.map((song, i) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    album={album}
                    artists={album.artist_to_album.map(({ artist }) => artist)}
                    trackNumber={i + 1}
                  />
                ))}
            </View>
          </View>
        ) : (
          <ScreenLoader />
        )}
      </PlayerScreen>
    </>
  );
}
