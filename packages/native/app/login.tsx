import { router, Redirect } from "expo-router";
import { Text, View } from "react-native";
import Button from "@/components/Button";

import { useSession } from "../hooks/auth-context";
import Hero from "@/components/layout/Hero";

export default function SignIn() {
  const { signIn } = useSession();

  return <Redirect href="/login" />;

  // return (
  //   <>
  //     <Hero />
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Button
  //         title="Login"
  //         onPress={() => {
  //           signIn();
  //           // Navigate after signing in. You may want to tweak this to ensure sign-in is
  //           // successful before navigating.
  //           router.replace('/');
  //         }}
  //       />
  //     </View>
  //   </>
  // );
}
