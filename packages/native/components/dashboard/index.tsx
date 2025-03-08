import { Text, View } from "react-native";
import { Album, Token } from "@peppermint/shared";

import { useAuthContext } from "../auth/context";
import { queryMany } from "~/utils/supabaseQuery";
import { supabase } from "~/utils/supabase";

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

  if (!data) {
    // todo: make spinner
    return <Text>Loading</Text>;
  }

  return (
    <View>
      {data.map((token, i) => (
        <Text key={i}>{token.album.name}</Text>
      ))}
    </View>
  );
}
