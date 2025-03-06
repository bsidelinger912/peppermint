import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vrkpvsbchkrpcggxknnj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZya3B2c2JjaGtycGNnZ3hrbm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzY0MjksImV4cCI6MjA1NjU1MjQyOX0.UJzVo3wHeEwg2r2EzQOexFuhkaNQn3-204eNiJBAd3M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
