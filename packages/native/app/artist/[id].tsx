import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
import { Artist, Album } from "@peppermint/shared";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
// import ScreenLoader from "~/components/ScreenLoader";
import Hero from "~/components/layout/hero/Hero";
import { LinearGradient } from "expo-linear-gradient";
// import { formatDuration } from "~/utils/formatting";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

type QueryResult = Artist & {
  artist_to_album: {
    album: Album;
  }[];
};

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const { bottom } = useSafeAreaInsets();

  const { data: artist } = queryOne<QueryResult>(
    async () =>
      await supabase
        .from("artist")
        .select("*, artist_to_album(album_id, album(*))")
        .eq("id", id)
        .single(),
    [{ table: "artist", filter: `id=eq.${id}` }]
  );

  function goToAlbum(albumId: number) {
    router.push({
      pathname: "/album/[id]",
      params: { id: albumId },
    });
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Hero image={artist ? artist.hero_image : ""}>
          <View className="absolute bottom-0 left-2">
            <Text className="text-4xl font-semibold text-white">{artist?.name}</Text>
          </View>
        </Hero>

        {artist && (
          <View className="flex flex-col gap-4 p-4">
            <Text className="text-2xl font-semibold">Albums</Text>

            <View className="grid grid-cols-2 gap-4">
              {artist.artist_to_album.map(({ album }) => (
                <TouchableOpacity
                  className="relative flex  aspect-square w-1/2 flex-col justify-end overflow-hidden rounded-lg"
                  key={album.id}
                  onPress={() => goToAlbum(album.id)}>
                  <ImageBackground
                    resizeMode="cover"
                    className="absolute inset-0 h-full w-full rounded-lg border border-gray-400"
                    source={{ uri: album.image }}
                  />

                  <LinearGradient
                    className="rounded-b-md"
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    locations={[0.5, 1]}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                    }}
                  />

                  <View className="flex flex-col gap-1 p-2">
                    <Text className="text-xl font-semibold text-white">{album.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}
