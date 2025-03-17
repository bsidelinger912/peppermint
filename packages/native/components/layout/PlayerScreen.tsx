import { ScrollView, View, Animated } from "react-native";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Player } from "../player/Player";
import { usePlayer } from "../player/PlayerContext";
import { useHeaderContext } from "./header/HeaderContext";

export default function PlayerScreen({ children }: { children: React.ReactNode }) {
  const { currentSong } = usePlayer();
  const {
    headerState: { scrollY },
  } = useHeaderContext();

  useFocusEffect(
    React.useCallback(() => {
      scrollY.setValue(0);
    }, [])
  );

  return (
    <View className="flex-1">
      <View className="flex-1" style={{ paddingBottom: currentSong ? 140 : 0 }}>
        <ScrollView
          className="flex-1"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}>
          {children}
        </ScrollView>
      </View>
      {currentSong && (
        <View className="absolute bottom-0 left-0 right-0 h-40 border-t border-t-slate-900 bg-slate-700">
          <Player />
        </View>
      )}
    </View>
  );
}
