import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { achievements } from '@/lib/achievements';
import { verifyWhopUser } from '@/lib/auth';
import { whopsdk } from '@/lib/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    let userId: string;
    try {
      userId = await verifyWhopUser();
    } catch (authError: any) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      );
    }

    const access = await whopsdk.users.checkAccess(companyId, { id: userId });
    if (!access.has_access) {
      return NextResponse.json(
        { error: 'No access to this company' },
        { status: 403 }
      );
    }

    const { data: userAchievements } = await supabaseAdmin
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId)
      .eq('company_id', companyId);

    return NextResponse.json({
      success: true,
      data: {
        unlocked: userAchievements?.map(a => a.achievement_id) || [],
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
