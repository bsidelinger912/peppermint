import { getContext, setContext } from "svelte";
import { supabase } from "$lib/supabase";
import type { User, Session, EmailOtpType } from "@supabase/supabase-js";
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

type SignInResult = {
  user: User;
  session: Session;
};

interface AuthContext {
  user: Writable<User | null>;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

const AUTH_CONTEXT_KEY = Symbol();

// async function verifyOtp(token_hash: string, type: EmailOtpType) {
//   console.log("vefying", token_hash, type);
//   const { error, data } = await supabase.auth.verifyOtp({ token_hash, type });

//   if (!error && data && data.session) {
//     console.log("******* redirect *******");
//     console.log(data.session);
//   }
// }

export function setAuthContext() {
  if (browser) {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      const token = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      // const type = params.get("type") as EmailOtpType;

      if (token && refreshToken) {
        // verifyOtp(token, type);
      }

      // const accessToken = params.get("access_token");
      // const refreshToken: Parameters.get()
      // if (accessToken) {
      //   supabase.auth.setSession({
      //     access_token: accessToken,
      //     refresh_token: params.get("refresh_token") ?? "",
      //   });
      // }
    }
  }

  const user = writable<User | null>(null);

  setContext<AuthContext>(AUTH_CONTEXT_KEY, {
    user,

    signIn: async (email: string, password: string) => {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Login failed");

      return data;
    },

    signUp: async (email: string, password: string) => {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Login failed");

      return data as SignInResult;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });

  // Initialize auth state from supabase session
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.set(session?.user ?? null);
  });

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    user.set(session?.user ?? null);
  });
}

export function getAuthContext() {
  return getContext<AuthContext>(AUTH_CONTEXT_KEY);
}
