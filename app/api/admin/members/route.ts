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

    // Get all user stats
    const { data: allUserStats } = await supabase
      .from('user_stats')
      .select('*')
      .order('total_sessions', { ascending: false });

    if (!allUserStats) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Get last active date for each user
    const membersWithActivity = await Promise.all(
      allUserStats.map(async (userStat) => {
        const { data: lastSession } = await supabase
          .from('focus_sessions')
          .select('completed_at')
          .eq('user_id', userStat.user_id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        const { data: firstSession } = await supabase
          .from('focus_sessions')
          .select('completed_at')
          .eq('user_id', userStat.user_id)
          .order('completed_at', { ascending: true })
          .limit(1)
          .single();

        return {
          userId: userStat.user_id,
          totalSessions: userStat.total_sessions || 0,
          totalFocusTime: userStat.total_focus_time || 0,
          streakDays: userStat.streak_days || 0,
          lastActive: lastSession?.completed_at || new Date().toISOString(),
          joinedAt: firstSession?.completed_at || new Date().toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: membersWithActivity,
    });
  } catch (error) {
    console.error('Error fetching admin members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}