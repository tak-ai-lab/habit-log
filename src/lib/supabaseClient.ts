
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error("Supabase URL and anon key are NOT set. Please create a .env file in the root of the project and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    // 環境変数が設定されていない場合はsupabaseをnullのままにする
}

export { supabase };
