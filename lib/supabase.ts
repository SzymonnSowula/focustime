import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FocusSession {
  id: string;
  user_id: string;
  mode: 'pomodoro' | 'deep-work' | 'custom';
  duration: number;
  completed_at: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  total_sessions: number;
  total_focus_time: number;
  streak_days: number;
  last_session_date: string;
}
