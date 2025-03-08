import { createContext, useContext } from "react";
import { type User } from "@supabase/supabase-js";

export type AuthContext<LoggedIn extends boolean | undefined = undefined> = {
  user: LoggedIn extends true ? User : LoggedIn extends false ? null : User | undefined;
  logout: () => void;
};

export const UserContext = createContext<AuthContext<undefined>>({
  user: undefined,
  logout: () => null,
});

export function useAuthContext<LoggedIn extends boolean | undefined = undefined>() {
  return useContext<AuthContext<LoggedIn>>(UserContext as any);
}
