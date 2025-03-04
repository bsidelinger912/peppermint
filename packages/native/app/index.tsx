import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "../constants/supabase";
import Login from "../components/Login";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      <Login />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
}
