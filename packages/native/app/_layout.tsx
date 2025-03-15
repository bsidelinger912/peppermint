import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";
import { Stack } from "expo-router";

import AuthProvider from "~/components/auth/AuthProvider";
import "../global.css";
import { PlayerProvider } from "~/components/player/PlayerContext";

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <EventProvider>
          <PlayerProvider>
            <Stack />
          </PlayerProvider>
        </EventProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
