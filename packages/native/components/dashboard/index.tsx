import { Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { Album, Token } from "@peppermint/shared";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthContext } from "../auth/context";
import { queryMany } from "~/utils/supabaseQuery";
import { supabase } from "~/utils/supabase";
import ScreenLoader from "../ScreenLoader";

type QueryResult = Token & {
  album: Album & {
    artist_to_album: {
      artist: {
        name: string;
        id: number;
      };
    }[];
  };
};

export default function Dashboard() {
  const { user } = useAuthContext<true>();

  const query = async () => {
    return await supabase
      .from("token")
      .select("*, album(*, artist_to_album(artist_id, artist(name, id)))")
      .eq("user_id", user.id);
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

  function goToArtist(artistId: number) {
    router.push({
      pathname: "/artist/[id]",
      params: { id: artistId },
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
            className="relative flex  aspect-square w-1/2 flex-col justify-end overflow-hidden rounded-lg"
            key={token.id}
            onPress={() => goToAlbum(token.album.id)}>
            <ImageBackground
              resizeMode="cover"
              className="absolute inset-0 h-full w-full rounded-lg border border-gray-400"
              source={{ uri: token.album.image }}
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
              <Text className="text-xl font-semibold text-white">{token.album.name}</Text>
              <View>
                {token.album.artist_to_album.map(({ artist }) => (
                  <TouchableOpacity key={artist.id} onPress={() => goToArtist(artist.id)}>
                    <Text className="text-l text-white">{artist.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
