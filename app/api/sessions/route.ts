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

export async function POST(request: NextRequest) {
  try {
    // Verify Whop user authentication
    let authenticatedUserId: string;
    try {
      authenticatedUserId = await verifyWhopUser();
    } catch (authError: any) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: authError.statusCode || 401 }
      );
    }
    
    const { mode, duration } = await request.json();

    if (!mode || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Use authenticated userId instead of client-provided one
    const userId = authenticatedUserId;

    // First, ensure user exists in user_stats table
    const { data: existingUser } = await supabase
      .from('user_stats')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (!existingUser) {
      // Create user stats entry if it doesn't exist
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          total_sessions: 0,
          total_focus_time: 0,
          streak_days: 0,
        });
    }

    // Insert the session (trigger will update stats automatically)
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: userId,
        mode,
        duration,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save session', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
