import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { achievements, checkAchievements } from '@/lib/achievements';

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user stats
    const { data: statsData } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user achievements from a custom table (you'll need to create this)
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId);

    const unlockedIds = userAchievements?.map(a => a.achievement_id) || [];

    // Check for newly unlocked achievements
    if (statsData) {
      const newlyUnlocked = checkAchievements({
        totalSessions: statsData.total_sessions || 0,
        totalFocusTime: statsData.total_focus_time || 0,
        streakDays: statsData.streak_days || 0,
      });

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
