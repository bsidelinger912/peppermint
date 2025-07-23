// import { type Query, type DocumentReference, onSnapshot } from "firebase/firestore";
import { onMount } from "svelte";
import { writable } from "svelte/store";
import {
  PostgrestError,
  type PostgrestSingleResponse,
  RealtimeChannel,
} from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

import { supabase } from "$lib/supabase";

type Watch = {
  table: string;
  filter?: string;
};

export function queryMany<T>(
  query: () => Promise<PostgrestSingleResponse<T[]> | null>,
  watches?: Watch[],
) {
  const data = writable<T[] | undefined>();
  const loading = writable(true);
  const error = writable<PostgrestError | undefined>();

  onMount(() => {
    const channelID = uuid();

    const fetchRows = async () => {
      loading.set(true);
      const queryResult = await query();

      if (!queryResult?.data) {
        loading.set(false);
        // todo *******
        error.set({
          message: "Not found",
          hint: "",
          code: "",
          details: "",
          name: "",
        });
        return;
      }

      const { data: queryData, error: err } = queryResult;

      if (err) {
        error.set(err);
      } else {
        data.set(queryData);
      }
      loading.set(false);
    };

    fetchRows();

    let subscriptions: RealtimeChannel[] = [];
    if (watches && watches.length > 0) {
      // Subscribe to real-time updates if watch args are passed
      watches.forEach((watch) => {
        subscriptions.push(
          supabase
            .channel(channelID)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: watch.table,
                filter: watch.filter ? watch.filter : undefined,
              },
              () => {
                fetchRows();
              },
            )
            .subscribe(),
        );
      });
    }

    return () => {
      subscriptions.forEach((subscription) =>
        supabase.removeChannel(subscription)
      );
    };
  });

  return { data, loading, error };
}

export function queryOne<T>(
  query: () => Promise<PostgrestSingleResponse<T>>,
  watches?: Watch[],
) {
  const data = writable<T | undefined>();
  const loading = writable(true);
  const error = writable<PostgrestError | undefined>();

  onMount(() => {
    const channelID = uuid();

    const fetchRow = async () => {
      loading.set(true);
      const { data: queryData, error: err } = await query();

      if (err) {
        error.set(err);
      } else {
        data.set(queryData);
      }
      loading.set(false);
    };

    fetchRow();

    let subscriptions: RealtimeChannel[] = [];
    if (watches && watches.length > 0) {
      // Subscribe to real-time updates if watch args are passed
      watches.forEach((watch) => {
        subscriptions.push(
          supabase
            .channel(channelID)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: watch.table,
                filter: watch.filter ? watch.filter : undefined,
              },
              () => {
                fetchRow();
              },
            )
            .subscribe(),
        );
      });
    }

    return () => {
      subscriptions.forEach((subscription) =>
        supabase.removeChannel(subscription)
      );
    };
  });

  return { data, loading, error };
}
