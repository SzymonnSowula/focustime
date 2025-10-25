import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWhopUser } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function GET(request: NextRequest) {
  try {
    // Verify Whop user authentication
    let userId: string;
    try {
      userId = await verifyWhopUser();
    } catch (authError: any) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: authError.statusCode || 401 }
      );
    }

    // Get user stats
    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for new users
      console.error('Supabase error:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todaySessions, error: todayError } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId)
      .gte('completed_at', today.toISOString());

    if (todayError) {
      console.error('Supabase error:', todayError);
    }

    // Get this week's sessions
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { data: weekSessions, error: weekError } = await supabase
      .from('focus_sessions')
      .select('duration')
      .eq('user_id', userId)
      .gte('completed_at', weekStart.toISOString());

    if (weekError) {
      console.error('Supabase error:', weekError);
    }

    // Calculate best streak
    const { data: allSessions } = await supabase
      .from('focus_sessions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    let bestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    allSessions?.forEach((session) => {
      const sessionDate = new Date(session.completed_at);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          bestStreak = Math.max(bestStreak, currentStreak);
          currentStreak = 1;
        }
      }

      lastDate = sessionDate;
    });

    bestStreak = Math.max(bestStreak, currentStreak);

    const stats = {
      totalSessions: statsData?.total_sessions || 0,
      totalFocusTime: statsData?.total_focus_time || 0,
      streakDays: statsData?.streak_days || 0,
      bestStreak,
      sessionsToday: todaySessions?.length || 0,
      sessionsThisWeek: weekSessions?.length || 0,
      focusTimeToday: todaySessions?.reduce((sum, s) => sum + s.duration, 0) || 0,
      focusTimeThisWeek: weekSessions?.reduce((sum, s) => sum + s.duration, 0) || 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
