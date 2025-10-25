import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { achievements, checkAchievements } from '@/lib/achievements';
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
    const { data: statsData } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId);

    const unlockedIds = userAchievements?.map(a => a.achievement_id) || [];

    // Get session data for special achievements
    const { data: sessions } = await supabase
      .from('focus_sessions')
      .select('mode, completed_at')
      .eq('user_id', userId);

    // Calculate special achievement data
    const pomodoroCount = sessions?.filter(s => s.mode === 'pomodoro').length || 0;
    const deepWorkCount = sessions?.filter(s => s.mode === 'deep-work').length || 0;
    
    // Check weekend sessions
    const saturdaySessions = sessions?.some(s => {
      const day = new Date(s.completed_at).getDay();
      return day === 6; // Saturday
    }) || false;
    
    const sundaySessions = sessions?.some(s => {
      const day = new Date(s.completed_at).getDay();
      return day === 0; // Sunday
    }) || false;

    // Check for newly unlocked achievements
    if (statsData) {
      const newlyUnlocked = checkAchievements(
        {
          totalSessions: statsData.total_sessions || 0,
          totalFocusTime: statsData.total_focus_time || 0,
          streakDays: statsData.streak_days || 0,
        },
        {
          pomodoroCount,
          deepWorkCount,
          weekendSessions: {
            saturday: saturdaySessions,
            sunday: sundaySessions,
          },
          completedAt: sessions?.[0] ? new Date(sessions[0].completed_at) : undefined,
        }
      );

      // Save newly unlocked achievements
      for (const achievement of newlyUnlocked) {
        if (!unlockedIds.includes(achievement.id)) {
          await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString(),
            });
          unlockedIds.push(achievement.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        unlocked: unlockedIds,
        total: achievements.length,
      },
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
