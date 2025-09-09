import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debugging: check if env vars are loaded
console.log("🔎 Supabase URL:", supabaseUrl);
console.log("🔑 Supabase Key (first 6 chars):", supabaseAnonKey?.slice(0, 6));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
