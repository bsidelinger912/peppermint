import React from "react";
import { Stack } from "expo-router";
import { View, Pressable, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { usePlayer, type SongAlbumAndArtists } from "~/components/player/PlayerContext";

import Typography from "~/components/ds/Typography";
import Hero from "~/components/layout/hero/Hero";
import Icon from "~/components/ds/Icon";
import { AnimatedBars } from "~/components/svg/AnimatedBars";
import { Player } from "~/components/player/Player";

export default function Queue() {
  const { queue, removeFromQueue, moveQueueItem, currentIndex, isPlaying, setQueueIndex } =
    usePlayer();

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
            <TouchableOpacity onPress={() => setQueueIndex(index)}>
              <Icon name="play" color="#334155" size={22} />
            </TouchableOpacity>
          )}

          {index !== currentIndex && (
            <Pressable onPress={() => removeFromQueue(index)} style={{ padding: 8 }}>
              <Icon name="close-circle-outline" color="#334155" size={22} />
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

      {queue.length > 0 ? (
        <GestureHandlerRootView>
          <DraggableFlatList
            data={queue}
            renderItem={renderQueueItem}
            keyExtractor={(item) => String(item.id)}
            onDragEnd={({ from, to }) => moveQueueItem(from, to)}
            ListHeaderComponent={<Hero />}
            ListFooterComponent={<Player />}
          />
        </GestureHandlerRootView>
      ) : (
        <>
          <Hero />
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Typography>Your queue is empty</Typography>
          </View>
        </>
      )}
    </>
  );
}
