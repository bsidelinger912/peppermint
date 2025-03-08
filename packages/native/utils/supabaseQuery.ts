import { useEffect, useState } from "react";
import { PostgrestError, PostgrestSingleResponse, RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { randomUUID } from "expo-crypto";

type Watch = {
  table: string;
  filter?: string;
};

export function queryMany<T>(
  query: () => Promise<PostgrestSingleResponse<T[]>>,
  watches?: Watch[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | undefined>();

  useEffect(() => {
    const channelID = randomUUID();

    const fetchRows = async () => {
      setLoading(true);
      const { data, error } = await query();

      if (error) {
        setError(error);
      } else {
        setData(data);
      }
      setLoading(false);
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
              }
            )
            .subscribe()
        );
      });
    }

    return () => {
      subscriptions.forEach((subscription) => supabase.removeChannel(subscription));
    };
  }, []);

  return { data, loading, error };
}

export function queryOne<T>(query: () => Promise<PostgrestSingleResponse<T>>, watches?: Watch[]) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | undefined>();

  useEffect(() => {
    const channelID = randomUUID();

    const fetchRow = async () => {
      setLoading(true);
      const { data, error } = await query();

      if (error) {
        setError(error);
      } else {
        setData(data);
      }
      setLoading(false);
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
              }
            )
            .subscribe()
        );
      });
    }

    return () => {
      subscriptions.forEach((subscription) => supabase.removeChannel(subscription));
    };
  }, []);

  return { data, loading, error };
}
