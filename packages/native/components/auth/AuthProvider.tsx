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
    setUser(undefined);

    try {
      await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // todo: handle this
    }
  }

  async function setSession(session: Pick<Session, "access_token" | "refresh_token">) {
    const { error, data } = await supabase.auth.setSession(session);

    if (error || !data.user) {
      throw new Error(error?.message || "No user returned from session");
    }

    setUser(data.user);
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // failed to parse key, todo: do something here
      }
    }
  }

  useEffect(() => {
    if (url) {
      console.log("*********", url);
      // check for login creds on the url
      const { queryParams } = parse(url);

      const access_token = queryParams?.token as string | undefined;
      const refresh_token = queryParams?.refresh_token as string | undefined;

      if (access_token && refresh_token) {
        try {
          setSession({ access_token, refresh_token });
          storeSession({ access_token, refresh_token });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // todo: do something here
        }
      }
    } else {
      //check secure storage
      checkForStoredSession();
    }
  }, [url]);

  return <UserContext.Provider value={{ user, logout }}>{children}</UserContext.Provider>;
}
