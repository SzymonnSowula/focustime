import { NextRequest, NextResponse } from 'next/server';
import { verifyWhopUser } from '@/lib/auth';
import { whopsdk } from '@/lib/whop-sdk';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAchievements } from '@/lib/achievements';

export async function POST(request: NextRequest) {
  try {
    const { mode, duration, companyId } = await request.json();
    
    if (!mode || !duration || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: mode, duration, companyId' },
        { status: 400 }
      );
    }

    let authenticatedUserId: string;
    try {
      authenticatedUserId = await verifyWhopUser();
    } catch (authError: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const access = await whopsdk.users.checkAccess(companyId, { id: authenticatedUserId });
    if (!access.has_access) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('focus_sessions')
      .insert({
        user_id: authenticatedUserId,
        company_id: companyId,
        mode,
        duration,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error during session insert:', error);
      return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
    }

    // --- Początek nowego bloku ---
    // 1. Pobierz zaktualizowane statystyki (trigger właśnie je zaktualizował)
    const { data: statsData } = await supabaseAdmin
      .from('user_stats')
      .select('*')
      .eq('user_id', authenticatedUserId)
      .single();

    // 2. Pobierz istniejące osiągnięcia
    const { data: userAchievements } = await supabaseAdmin
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', authenticatedUserId)
      .eq('company_id', companyId);

    const unlockedIds = userAchievements?.map(a => a.achievement_id) || [];

    // 3. Sprawdź, czy są nowe osiągnięcia
    const newlyUnlocked = checkAchievements(
      {
        totalSessions: statsData?.total_sessions || 0,
        totalFocusTime: statsData?.total_focus_time || 0,
        streakDays: statsData?.streak_days || 0,
        pomodoroCount: statsData?.pomodoro_count || 0,
        deepWorkCount: statsData?.deep_work_count || 0,
      },
      {
        completedAt: new Date(),
        // Możesz dodać logikę weekendu, jeśli chcesz, np.:
        // weekendSessions: { saturday: new Date().getDay() === 6, sunday: new Date().getDay() === 0 }
      }
    ).filter(ach => !unlockedIds.includes(ach.id)); // Filtruj tylko *nowe*

    // 4. Zapisz nowe osiągnięcia w bazie
    if (newlyUnlocked.length > 0) {
      const achievementsToInsert = newlyUnlocked.map(ach => ({
        user_id: authenticatedUserId,
        company_id: companyId,
        achievement_id: ach.id,
        unlocked_at: new Date().toISOString(),
      }));
      await supabaseAdmin.from('user_achievements').insert(achievementsToInsert);
    }

    // 5. Zwróć dane sesji ORAZ nowe osiągnięcia
    return NextResponse.json({ success: true, data, newAchievements: newlyUnlocked });
    // --- Koniec nowego bloku ---
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}