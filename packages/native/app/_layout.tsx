import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";
import AuthProvider from "~/components/auth/AuthProvider";
import "../global.css";

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <EventProvider>
          <Stack />
        </EventProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
