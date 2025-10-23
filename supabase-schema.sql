-- FocusTime Supabase Schema
-- Run this in your Supabase SQL Editor

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('pomodoro', 'deep-work', 'custom')),
  duration INTEGER NOT NULL, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  total_sessions INTEGER DEFAULT 0,
  total_focus_time INTEGER DEFAULT 0, -- in seconds
  streak_days INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO user_stats (user_id, total_sessions, total_focus_time, last_session_date, updated_at)
  VALUES (
    NEW.user_id,
    1,
    NEW.duration,
    CURRENT_DATE,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_stats.total_sessions + 1,
    total_focus_time = user_stats.total_focus_time + NEW.duration,
    last_session_date = CURRENT_DATE,
    updated_at = NOW(),
    -- Update streak
    streak_days = CASE
      WHEN user_stats.last_session_date = CURRENT_DATE THEN user_stats.streak_days
      WHEN user_stats.last_session_date = CURRENT_DATE - INTERVAL '1 day' THEN user_stats.streak_days + 1
      ELSE 1
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update stats
CREATE TRIGGER update_stats_on_session
  AFTER INSERT ON focus_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id TEXT)
RETURNS TABLE (
  total_sessions INTEGER,
  total_focus_time INTEGER,
  streak_days INTEGER,
  sessions_today INTEGER,
  sessions_this_week INTEGER,
  focus_time_today INTEGER,
  focus_time_this_week INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(us.total_sessions, 0) as total_sessions,
    COALESCE(us.total_focus_time, 0) as total_focus_time,
    COALESCE(us.streak_days, 0) as streak_days,
    COALESCE((
      SELECT COUNT(*)::INTEGER
      FROM focus_sessions
      WHERE user_id = p_user_id
        AND DATE(completed_at) = CURRENT_DATE
    ), 0) as sessions_today,
    COALESCE((
      SELECT COUNT(*)::INTEGER
      FROM focus_sessions
      WHERE user_id = p_user_id
        AND completed_at >= DATE_TRUNC('week', CURRENT_DATE)
    ), 0) as sessions_this_week,
    COALESCE((
      SELECT SUM(duration)::INTEGER
      FROM focus_sessions
      WHERE user_id = p_user_id
        AND DATE(completed_at) = CURRENT_DATE
    ), 0) as focus_time_today,
    COALESCE((
      SELECT SUM(duration)::INTEGER
      FROM focus_sessions
      WHERE user_id = p_user_id
        AND completed_at >= DATE_TRUNC('week', CURRENT_DATE)
    ), 0) as focus_time_this_week
  FROM user_stats us
  WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
-- For now, allow all operations (you should restrict this based on your auth)
CREATE POLICY "Allow all operations on focus_sessions" ON focus_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on user_stats" ON user_stats
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON focus_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON focus_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_mode ON focus_sessions(mode);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate achievements
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for achievements
CREATE POLICY "Allow all operations on user_achievements" ON user_achievements
  FOR ALL USING (true);

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user_achievement ON user_achievements(user_id, achievement_id);

-- Sample query to test
-- SELECT * FROM get_user_stats('your_user_id_here');
