import React from "react";
import { Stack } from "expo-router";
import { View, Pressable, GestureResponderEvent } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { usePlayer, type SongAlbumAndArtists } from "~/components/player/PlayerContext";

import Typography from "~/components/ds/Typography";
import Hero from "~/components/layout/hero/Hero";
import Icon from "~/components/ds/Icon";

type QueueItemProps = {
  item: SongAlbumAndArtists;
  // index: number;
  drag: (event: GestureResponderEvent) => void;
  isActive: boolean;
};

export default function Queue() {
  const { queue, removeFromQueue, moveQueueItem } = usePlayer();

  const renderQueueItem = ({ item, drag, isActive }: QueueItemProps) => (
    <ScaleDecorator>
      <Pressable
        onPress={() => {
          /* Handle playing specific item */
        }}
        style={{
          flexDirection: "row",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          alignItems: "center",
          backgroundColor: isActive ? "#f0f0f0" : "white",
        }}>
        {/* TODO: this is janky to have to press then start dragging */}
        <Pressable onLongPress={drag} style={{ padding: 8 }}>
          <Icon name="reorder-three" size={32} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Typography>{item.title}</Typography>
          <Typography>{item.artists[0].name}</Typography>
        </View>

        {/* TODO: remove the correct indexed item, need to figure out how to get index */}
        <Pressable onPress={() => removeFromQueue(0)} style={{ padding: 8 }}>
          <Typography>Remove</Typography>
        </Pressable>
      </Pressable>
    </ScaleDecorator>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <GestureHandlerRootView>
        <Hero />
        {queue.length > 0 ? (
          <DraggableFlatList
            data={queue}
            renderItem={renderQueueItem}
            keyExtractor={(item) => String(item.id)}
            onDragEnd={({ from, to }) => moveQueueItem(from, to)}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Typography>Your queue is empty</Typography>
          </View>
        )}
      </GestureHandlerRootView>
    </>
  );
}
