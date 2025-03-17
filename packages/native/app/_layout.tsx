import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";
import { Stack } from "expo-router";

import AuthProvider from "~/components/auth/AuthProvider";
import "../global.css";
import { PlayerProvider } from "~/components/player/PlayerContext";
import Header from "~/components/layout/header/Header";
import { HeaderContextProvider } from "~/components/layout/header/HeaderContext";

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <EventProvider>
          <HeaderContextProvider>
            <PlayerProvider>
              <Header />
              <Stack />
            </PlayerProvider>
          </HeaderContextProvider>
        </EventProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
