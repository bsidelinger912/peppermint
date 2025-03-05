import { Stack } from "expo-router";
import { View, Text } from "react-native";

// import { Button } from "~/components/Button";
import Hero from "~/components/layout/Hero";
// import { ScreenContent } from "~/components/ScreenContent";

export default function Home() {
  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <Hero />
      <Text>yoyo</Text>
    </View>
  );
}
