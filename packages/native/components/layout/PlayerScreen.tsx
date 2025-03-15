import { ScrollView, View } from "react-native";

import { Player } from "../player/Player";
import { usePlayer } from "../player/PlayerContext";

export default function PlayerScreen({ children }: { children: React.ReactNode }) {
  const { currentSong } = usePlayer();
  return (
    <View className="flex-1">
      <View className="flex-1" style={{ paddingBottom: currentSong ? 140 : 0 }}>
        <ScrollView className="flex-1">{children}</ScrollView>
      </View>
      {currentSong && (
        <View className="absolute bottom-0 left-0 right-0 h-40 border-t border-t-slate-900 bg-slate-700">
          <Player />
        </View>
      )}
    </View>
  );
}
