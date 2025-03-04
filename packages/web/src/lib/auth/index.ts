import { getContext, setContext } from "svelte";
import { supabase } from "$lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { writable, type Writable } from "svelte/store";

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

export function setAuthContext() {
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
