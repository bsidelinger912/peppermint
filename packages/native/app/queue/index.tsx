import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Pressable, TouchableOpacity, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useRouter } from "expo-router";

import { usePlayer, type SongAlbumAndArtists } from "~/components/player/PlayerContext";
import Typography from "~/components/ds/Typography";
import Icon from "~/components/ds/Icon";
import { AnimatedBars } from "~/components/svg/AnimatedBars";
import { Player } from "~/components/player/Player";
import { useHeaderContext } from "~/components/layout/header/HeaderContext";

export default function Queue() {
  const {
    queue,
    removeFromQueue,
    moveQueueItem,
    currentIndex,
    isPlaying,
    setQueueIndex,
    playPause,
  } = usePlayer();

  const router = useRouter();
  const { setHeaderState } = useHeaderContext();

  useEffect(() => {
    setHeaderState((curr) => ({
      ...curr,
      title: undefined,
      hasImage: false,
      backNavigation: router.back,
    }));
  }, []);

  const renderQueueItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<SongAlbumAndArtists>) => {
    const index = getIndex() as number;

    return (
      <ScaleDecorator>
        <View
          style={{
            flexDirection: "row",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            alignItems: "center",
            backgroundColor: isActive ? "#f0f0f0" : "white",
          }}>
          <Pressable onLongPress={drag} style={{ padding: 8 }}>
            <Icon name="reorder-three" size={32} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Typography>{item.title}</Typography>
            <Typography>{item.artists[0].name}</Typography>
          </View>

          {index === currentIndex && isPlaying ? (
            <AnimatedBars />
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (index === currentIndex) {
                  playPause();
                } else {
                  setQueueIndex(index);
                }
              }}>
              <Icon name="play" color="#334155" size={22} />
            </TouchableOpacity>
          )}

          {index !== currentIndex || !isPlaying ? (
            <Pressable onPress={() => removeFromQueue(index)} style={{ padding: 8 }}>
              <Icon name="close-circle-outline" color="#334155" size={22} />
            </Pressable>
          ) : (
            <Pressable onPress={() => playPause()} style={{ padding: 8 }}>
              <Icon name="pause" color="#334155" size={22} />
            </Pressable>
          )}
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* TODO: maybe just equip header with this ability??? */}
      <View className="h-32 items-center justify-end bg-black pb-3">
        <Text className="text-lg text-white">Queue</Text>
      </View>

      {queue.length > 0 ? (
        <GestureHandlerRootView>
          <DraggableFlatList
            data={queue}
            renderItem={renderQueueItem}
            keyExtractor={(item) => String(item.id)}
            onDragEnd={({ from, to }) => moveQueueItem(from, to)}
            ListFooterComponent={<Player />}
          />
        </GestureHandlerRootView>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Typography>Your queue is empty</Typography>
        </View>
      )}
    </>
  );
}
