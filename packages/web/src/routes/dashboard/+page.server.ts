import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { user } = await event.parent();

  if (!user) {
    redirect(401, "/login");
  }
};
