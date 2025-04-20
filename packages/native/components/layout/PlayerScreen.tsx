import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import React from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import { Player } from "../player/Player";
import { usePlayer } from "../player/PlayerContext";
import { useHeaderContext } from "./header/HeaderContext";

export default function PlayerScreen({ children }: { children: React.ReactNode }) {
  const { currentSong } = usePlayer();
  const { setHeaderState } = useHeaderContext();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      setHeaderState((curr) => ({
        ...curr,
        scrollPosition: 0,
      }));
    }, [])
  );

  return (
    <View className="flex-1">
      <View className="flex-1" style={{ paddingBottom: currentSong ? 140 : 0 }}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          onScroll={({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
            if (!isFocused) {
              return;
            }

            const scrollPosition = nativeEvent.contentOffset.y;
            setHeaderState((curr) => ({
              ...curr,
              scrollPosition,
            }));
          }}
          scrollEventThrottle={16}>
          {children}
        </ScrollView>
      </View>
      {currentSong && (
        <View className="absolute bottom-0 left-0 right-0 h-40">
          <Player />
        </View>
      )}
    </View>
  );
}
