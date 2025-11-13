import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyWhopUser } from '@/lib/auth';
import { whopsdk } from '@/lib/whop-sdk';

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

    // Verify user has access to this company
    const access = await whopsdk.users.checkAccess(companyId, { id: userId });
    if (!access.has_access) {
      return NextResponse.json(
        { error: 'No access to this company' },
        { status: 403 }
      );
    }

    // Get all user stats for the company
    const { data: allUserStats } = await supabaseAdmin
      .from('user_stats')
      .select('*')
      .eq('company_id', companyId)
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
        const { data: lastSession } = await supabaseAdmin
          .from('focus_sessions')
          .select('completed_at')
          .eq('user_id', userStat.user_id)
          .eq('company_id', companyId)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        const { data: firstSession } = await supabaseAdmin
          .from('focus_sessions')
          .select('completed_at')
          .eq('user_id', userStat.user_id)
          .eq('company_id', companyId)
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