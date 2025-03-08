import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { Album } from "@peppermint/shared";
import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
import ScreenLoader from "~/components/ScreenLoader";
import Hero from "~/components/layout/Hero";

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: album } = queryOne<Album>(
    async () => await supabase.from("album").select("*").eq("id", id).single(),
    [{ table: "album", filter: `id=eq.${id}` }]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <Hero>
          <View className="absolute bottom-0 left-2">
            <Text className="text-4xl font-semibold text-white">{album?.name}</Text>
          </View>
        </Hero>

        {album ? (
          <View className="p-4">
            <Text className="text-3xl font-bold">{album.name}</Text>
            {album.description && <Text className="mt-2">{album.description}</Text>}
          </View>
        ) : (
          <ScreenLoader />
        )}
      </View>
    </>
  );
}
