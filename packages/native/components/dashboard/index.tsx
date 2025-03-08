import { Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { Album, Token } from "@peppermint/shared";
import { router } from "expo-router";

import { useAuthContext } from "../auth/context";
import { queryMany } from "~/utils/supabaseQuery";
import { supabase } from "~/utils/supabase";
import ScreenLoader from "../ScreenLoader";

type QueryResult = Token & {
  album: Album;
};

export default function Dashboard() {
  const { user } = useAuthContext<true>();

  const query = async () => {
    return await supabase.from("token").select("*, album(*)").eq("user_id", user.id);
  };

  const { data } = queryMany<QueryResult>(query, [
    { table: "token", filter: `user_id=eq.${user.id}` },
  ]);

  function goToAlbum(albumId: number) {
    router.push({
      pathname: "/album/[id]",
      params: { id: albumId },
    });
  }

  if (!data) {
    return <ScreenLoader />;
  }

  return (
    <View className="flex flex-col gap-4 p-4">
      <Text className="text-2xl font-semibold">Your Music</Text>
      <View className="grid grid-cols-2 gap-4">
        {data.map((token) => (
          <TouchableOpacity
            className="w-1/2 aspect-square border border-gray-400 rounded-md"
            key={token.id}
            onPress={() => goToAlbum(token.album.id)}
          >
            <ImageBackground
              resizeMode="cover"
              className="w-full h-full"
              source={{ uri: token.album.image }}
            >
              <Text>{token.album.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
