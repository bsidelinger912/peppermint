// import { router, Redirect } from "expo-router";
import { Text, View, Linking } from "react-native";
import Button from "@/components/Button";

// import { useSession } from "../hooks/auth-context";
import Hero from "@/components/layout/Hero";

const LOGIN_URL = "http://localhost:5173/login";

export default function SignIn() {
  // const { signIn } = useSession();

  // return <Redirect href="/login" />;

  return (
    <View>
      <Hero />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Login"
          onPress={() => {
            Linking.openURL(LOGIN_URL);
          }}
        />
      </View>
    </View>
  );
}
