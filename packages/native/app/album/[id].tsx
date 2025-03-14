import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Album, Song, Artist } from "@peppermint/shared";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
import ScreenLoader from "~/components/ScreenLoader";
import Hero from "~/components/layout/Hero";
import AddToQueue from "~/components/svg/AddToQueue";
import { formatDuration } from "~/utils/formatting";
import { AlbumDownloadButton } from "~/components/AlbumDownloadButton";

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

  function goToSong(songId: number) {
    router.push({
      pathname: "/song/[id]",
      params: { id: songId },
    });
  }

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
      <ScrollView>
        <Hero image={album?.image || ""}>
          {album && (
            <View className="absolute bottom-0 left-2 flex gap-3">
              <Text className="text-4xl font-semibold text-white">{album?.name}</Text>
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
                <Ionicons name="play-circle-outline" size={48} />
                <AddToQueue size={28} />
              </View>

              <AlbumDownloadButton
                album={album}
                songs={album.song_to_album.map(({ song }) => song)}
              />
            </View>
            {album.description && (
              <View className="flex flex-col gap-3">
                <Text className="text-xl font-semibold">From the artist:</Text>
                <Text>{album.description}</Text>
              </View>
            )}

            <View className="w-full border border-slate-600" />

            <View className="flex flex-col gap-3">
              <Text className="text-2xl font-semibold">Songs</Text>
            </View>

            <View className="gap-4">
              {sortedSongs &&
                sortedSongs.map((song, i) => (
                  <View key={song.id} className="flex flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => goToSong(song.id)}>
                      <Text className="text-xl">
                        {i + 1}: {song.title}
                      </Text>
                    </TouchableOpacity>

                    <View className="flex flex-row items-center gap-3">
                      <Text>{formatDuration(song.duration)}</Text>
                      <TouchableOpacity>
                        <Ionicons name="play-circle" size={24} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <AddToQueue size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        ) : (
          <ScreenLoader />
        )}
      </ScrollView>
    </>
  );
}
