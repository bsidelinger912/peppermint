import { ScrollView, View } from "react-native";
import { Player } from "../player/Player";

export default function PlayerScreen({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1">
      <View className="flex-1 pb-40">
        <ScrollView className="flex-1">{children}</ScrollView>
      </View>
      <View className="absolute bottom-0 left-0 right-0 h-40 bg-white">
        <Player />
      </View>
    </View>
  );
}
