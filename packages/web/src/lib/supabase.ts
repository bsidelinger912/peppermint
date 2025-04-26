import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { RequestEvent } from "@sveltejs/kit";

export const COOKIE_KEY = "sb-auth-token";

export const supabase = createClient(
  "https://vrkpvsbchkrpcggxknnj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZya3B2c2JjaGtycGNnZ3hrbm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzY0MjksImV4cCI6MjA1NjU1MjQyOX0.UJzVo3wHeEwg2r2EzQOexFuhkaNQn3-204eNiJBAd3M"
);

export function supabaseServer(event: RequestEvent) {
  return createServerClient(
    "https://vrkpvsbchkrpcggxknnj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZya3B2c2JjaGtycGNnZ3hrbm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzY0MjksImV4cCI6MjA1NjU1MjQyOX0.UJzVo3wHeEwg2r2EzQOexFuhkaNQn3-204eNiJBAd3M",
    {
      cookies: {
        get: (key: string) => event.cookies.get(key),
        set: (key: string, value: string, options: CookieOptions) => {
          event.cookies.set(key, value, { ...options, path: "/" });
        },
        remove: (key: string, options: CookieOptions) => {
          event.cookies.delete(key, { ...options, path: "/" });
        },
      },
    }
  );
}
