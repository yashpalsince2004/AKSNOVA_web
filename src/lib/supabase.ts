import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return "";
};

const supabaseUrl =
  getEnvVar("PUBLIC_SUPABASE_URL") ||
  getEnvVar("SUPABASE_URL") ||
  "https://aehbrvlqyavkfgmkadtl.supabase.co/";

const supabaseAnonKey =
  getEnvVar("PUBLIC_SUPABASE_ANON_KEY") ||
  getEnvVar("SUPABASE_ANON_KEY") ||
  "sb_publishable_r2sRtssLVNSAzT9eOvvn9A_V-84vPxR";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

