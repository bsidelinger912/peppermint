import { useEffect, useState } from "react";
import { type User, type Session } from "@supabase/supabase-js";
import { useURL, parse } from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { supabase } from "~/utils/supabase";
import { UserContext } from "./context";

const SESSION_STORAGE_KEY = "session_storage";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const url = useURL();

  async function logout() {
    supabase.auth.signOut();
  }

  async function setSession(session: Pick<Session, "access_token" | "refresh_token">) {
    const { error, data } = await supabase.auth.setSession(session);

    if (error || !data.user) {
      throw new Error(error?.message || "No user returned from session");
    }

    setUser(data.user);
    storeSession(session);
  }

  async function storeSession(session: Pick<Session, "access_token" | "refresh_token">) {
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  async function checkForStoredSession() {
    let storedSession = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);

    if (storedSession) {
      try {
        const session = JSON.parse(storedSession) as Session;
        setSession(session);
      } catch (e) {
        // failed to parse key, todo: do something here
        console.error("Error hydrating session", (e as Error).message);
      }
    }
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        if (session) {
          storeSession(session);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(undefined);
        await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
      }
    });

    if (url) {
      // check for login creds on the url
      const { queryParams } = parse(url);

      const access_token = queryParams?.token as string | undefined;
      const refresh_token = queryParams?.refresh_token as string | undefined;

      if (access_token && refresh_token) {
        try {
          setSession({ access_token, refresh_token });
        } catch (e) {
          // todo: do something better here
          console.error("Error initiating session", (e as Error).message);
        }
      }
    } else {
      //check secure storage
      checkForStoredSession();
    }
  }, [url]);

  return <UserContext.Provider value={{ user, logout }}>{children}</UserContext.Provider>;
}
