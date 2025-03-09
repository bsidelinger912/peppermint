import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
import { Artist } from "@peppermint/shared";

import { supabase } from "~/utils/supabase";
import { queryOne } from "~/utils/supabaseQuery";
// import ScreenLoader from "~/components/ScreenLoader";
import Hero from "~/components/layout/Hero";
// import { formatDuration } from "~/utils/formatting";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const { bottom } = useSafeAreaInsets();

  const { data: artist } = queryOne<Artist>(
    async () => await supabase.from("artist").select("*").eq("id", id).single(),
    [{ table: "artist", filter: `id=eq.${id}` }]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Hero>
          <View className="absolute bottom-0 left-2">
            <Text className="text-4xl font-semibold text-white">{artist?.name}</Text>
          </View>
        </Hero>

        {artist && (
          <View>
            <Text>have data</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
