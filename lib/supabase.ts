import { createClient } from "@supabase/supabase-js";

// Safe fallback values so build doesn't crash without env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const getServerSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
};

// Database types matching our schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          plan: "free" | "premium";
          current_level: string;
          target_level: string;
          daily_goal: number;
          streak_days: number;
          total_xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      reading_exercises: {
        Row: {
          id: string; title: string; level: string; text: string;
          questions: Record<string, unknown>[]; time_limit: number | null;
          topic: string; is_active: boolean; created_at: string;
        };
      };
      listening_exercises: {
        Row: {
          id: string; title: string; level: string; audio_url: string;
          transcript: string | null; questions: Record<string, unknown>[];
          duration: number; topic: string; is_active: boolean; created_at: string;
        };
      };
      speaking_prompts: {
        Row: {
          id: string; level: string; prompt: string; duration: number;
          topic: string; example_response: string | null; created_at: string;
        };
      };
      writing_prompts: {
        Row: {
          id: string; level: string; prompt: string; word_count_min: number;
          word_count_max: number; topic: string; example_response: string | null; created_at: string;
        };
      };
      user_progress: {
        Row: {
          id: string; user_id: string; module: string; exercise_id: string;
          score: number; cefr_level: string; completed_at: string;
          time_spent: number; details: Record<string, unknown>;
        };
      };
    };
  };
};
