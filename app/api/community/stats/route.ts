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
    const userId = await verifyWhopUser();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      );
    }

    // Get all community members' stats
    const { data: allMembers } = await supabase
      .from('focus_sessions')
      .select('user_id, duration, completed_at')
      .order('completed_at', { ascending: false });

    if (!allMembers || allMembers.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalSessions: 0,
          totalFocusTime: 0,
          activeMembersToday: 0,
          topMembers: [],
        },
      });
    }

    // Calculate total stats
    const totalSessions = allMembers.length;
    const totalFocusTime = allMembers.reduce((sum, s) => sum + s.duration, 0);

    // Get today's active members
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMembers = new Set(
      allMembers
        .filter(s => new Date(s.completed_at) >= today)
        .map(s => s.user_id)
    );
    const activeMembersToday = todayMembers.size;

    // Get this week's stats for leaderboard
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekSessions = allMembers.filter(
      s => new Date(s.completed_at) >= weekStart
    );

    // Calculate per-user stats for this week
    const userStats = new Map<string, { sessions: number; focusTime: number }>();
    
    thisWeekSessions.forEach(session => {
      const current = userStats.get(session.user_id) || { sessions: 0, focusTime: 0 };
      userStats.set(session.user_id, {
        sessions: current.sessions + 1,
        focusTime: current.focusTime + session.duration,
      });
    });

    // Get top 10 members
    const topMembers = Array.from(userStats.entries())
      .sort((a, b) => b[1].focusTime - a[1].focusTime)
      .slice(0, 10)
      .map(([userId, stats]) => ({
        userId,
        sessions: stats.sessions,
        focusTime: stats.focusTime,
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalSessions,
        totalFocusTime,
        activeMembersToday,
        topMembers,
      },
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}