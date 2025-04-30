import { createClient, type SupabaseClient as BaseSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export type SupabaseClient = BaseSupabaseClient<Database>;
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
