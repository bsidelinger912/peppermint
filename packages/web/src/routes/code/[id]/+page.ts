import { supabase } from "$lib/supabase";
import { redirect } from "@sveltejs/kit";

import type { RedemptionCode } from "@peppermint/shared";

import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
  const id = event.params.id;
  const { data, error } = await supabase.functions.invoke<{ data: RedemptionCode }>("get-code", {
    body: { id },
  });

  if (error || !data) {
    redirect(404, "/");
  } else {
    return {
      redemptionCode: data.data,
    };
  }
};
