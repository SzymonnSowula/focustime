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
    const range = searchParams.get('range') || 'week';

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate = new Date(0); // All time
    }

    // Get all sessions
    const { data: allSessions } = await supabase
      .from('focus_sessions')
      .select('*')
      .gte('completed_at', startDate.toISOString());

    // Get unique users
    const uniqueUsers = new Set(allSessions?.map(s => s.user_id) || []);
    const totalMembers = uniqueUsers.size;

    // Get users active this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeThisWeek = new Set(
      allSessions
        ?.filter(s => new Date(s.completed_at) >= weekAgo)
        .map(s => s.user_id) || []
    ).size;

    // Calculate total stats
    const totalSessions = allSessions?.length || 0;
    const totalFocusTime = allSessions?.reduce((sum, s) => sum + s.duration, 0) || 0;
    const totalFocusHours = Math.round(totalFocusTime / 3600);

    // Average session duration
    const avgSessionDuration = totalSessions > 0
      ? Math.round(totalFocusTime / totalSessions / 60)
      : 0;

    // Sessions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionsToday = allSessions?.filter(
      s => new Date(s.completed_at) >= today
    ).length || 0;

    // Week growth (mock calculation - compare with previous week)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const lastWeekSessions = allSessions?.filter(
      s => new Date(s.completed_at) >= twoWeeksAgo && new Date(s.completed_at) < weekAgo
    ).length || 1;
    const thisWeekSessions = allSessions?.filter(
      s => new Date(s.completed_at) >= weekAgo
    ).length || 0;
    const weekGrowth = Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100);

    // Completion rate (all sessions are completed, so 100% - you can add logic for abandoned sessions)
    const completionRate = 100;

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        activeThisWeek,
        totalSessions,
        totalFocusHours,
        avgSessionDuration,
        completionRate,
        sessionsToday,
        weekGrowth: Math.max(0, weekGrowth),
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}