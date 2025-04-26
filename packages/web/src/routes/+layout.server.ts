import { COOKIE_KEY, supabaseServer } from "$lib/supabase";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const supabaseCookie = event.cookies.get(COOKIE_KEY);

  if (supabaseCookie) {
    try {
      const parsedToken = JSON.parse(supabaseCookie);
      const supabase = supabaseServer(event);
      const session = await supabase.auth.setSession(parsedToken);

      return {
        user: session.data.session?.user,
      };
    } catch (e) {
      return { user: undefined };
    }
  }

  return { user: undefined };
};
