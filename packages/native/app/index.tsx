import { Stack } from "expo-router";
import { View, Text, Button, Linking } from "react-native";

// import { Button } from "~/components/Button";
import Hero from "~/components/layout/Hero";
import { useContext } from "react";
import { UserContext } from "~/components/auth/context";
// import { ScreenContent } from "~/components/ScreenContent";

export default function Home() {
  const login = () => {
    Linking.openURL("http://localhost:5173/login?redirect=foobar");
  };

  const { user, logout } = useContext(UserContext);

  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <Hero />
      {user ? (
        <View>
          <Text className="text-center text-xl">Hello, {user.email}</Text>
          <Button onPress={logout} title="Log out" />
        </View>
      ) : (
        <Button onPress={login} title="Login" />
      )}
    </View>
  );
}
