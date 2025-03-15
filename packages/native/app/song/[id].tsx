import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Song } from "@peppermint/shared";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
import Hero from "~/components/layout/hero/Hero";
import AddToQueue from "~/components/svg/AddToQueue";
import PlayerScreen from "~/components/layout/PlayerScreen";

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();

  const { data: song } = queryOne<Song>(
    async () => await supabase.from("song").select("*").eq("id", id).single(),
    [{ table: "song", filter: `id=eq.${id}` }]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlayerScreen>
        <Hero>
          <View className="absolute bottom-0 left-2">
            <Text className="text-4xl font-semibold text-white">{song?.title}</Text>
          </View>
        </Hero>

        {song && (
          <View className="flex flex-col gap-6 p-4" style={{ paddingBottom: bottom }}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-3">
                <Ionicons name="play-circle-outline" size={48} />
                <AddToQueue size={28} />
              </View>

              <View>
                <Ionicons name="download-outline" size={28} />
              </View>
            </View>

            {song.description && <Text>{song.description}</Text>}

            {song.lyrics && (
              <View className="flex gap-3">
                <Text className="text-xl font-semibold">Lyrics</Text>

                <Text>{song.lyrics}</Text>
              </View>
            )}
          </View>
        )}
      </PlayerScreen>
    </>
  );
}
