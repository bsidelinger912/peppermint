import { Stack } from "expo-router";
import { View, Button, Linking } from "react-native";

import Hero from "~/components/layout/Hero";
import { useAuthContext } from "~/components/auth/context";
import Dashboard from "~/components/dashboard";

export default function Home() {
  const login = () => {
    Linking.openURL("http://localhost:5173/login?redirect=foobar");
  };

  const { user } = useAuthContext();

  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <Hero />
      {user ? <Dashboard /> : <Button onPress={login} title="Login" />}
    </View>
  );
}
