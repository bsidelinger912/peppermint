import React from "react";
import { Stack } from "expo-router";
import { Button, Linking } from "react-native";

import Hero from "~/components/layout/hero/Hero";
import { useAuthContext } from "~/components/auth/context";
import Dashboard from "~/components/dashboard";
import PlayerScreen from "~/components/layout/PlayerScreen";

export default function Home() {
  const login = () => {
    Linking.openURL(`${process.env.EXPO_PUBLIC_WEB_URL}/login?redirect=${encodeURIComponent("peppermint://")}`);
  };

  const { user } = useAuthContext();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlayerScreen>
        <Hero />
        {user ? <Dashboard /> : <Button onPress={login} title="Login" />}
      </PlayerScreen>
    </>
  );
}
