import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["PUBLIC_SUPABASE_URL"] || import.meta.env["SUPABASE_URL"];

const supabaseAnonKey =
  import.meta.env["PUBLIC_SUPABASE_ANON_KEY"] || import.meta.env["SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase configuration missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
