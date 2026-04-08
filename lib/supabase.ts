import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      lessons: {
        Row: {
          id: number
          phase: number
          phase_name: string
          order: number
          title: string
          text: string
          unlock_wpm: number
          description: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], never>
        Update: Partial<Database["public"]["Tables"]["lessons"]["Row"]>
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: number
          best_wpm: number
          best_accuracy: number
          attempts: number
          completed_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["progress"]["Row"], "id" | "completed_at">
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>
      }
    }
  }
}
