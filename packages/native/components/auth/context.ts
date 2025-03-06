import { createContext } from "react";
import { type User } from "@supabase/supabase-js";

export type UserContextType = { user: User | undefined; logout: () => void };

export const UserContext = createContext<UserContextType>({
  user: undefined,
  logout: () => null,
});
