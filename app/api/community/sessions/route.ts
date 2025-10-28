import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWhopUser } from '@/lib/auth';
import { whopsdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';

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

// GET - Fetch active community sessions
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

    // Get active sessions (started in last 3 hours and not completed)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    
    const { data: sessions, error } = await supabase
      .from('community_sessions')
      .select('*')
      .eq('company_id', companyId)
      .gte('started_at', threeHoursAgo)
      .is('ended_at', null)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Get participant counts for each session
    const sessionsWithCounts = await Promise.all(
      (sessions || []).map(async (session) => {
        const { count } = await supabase
          .from('community_session_participants')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', session.id)
          .is('left_at', null);

        return {
          ...session,
          activeParticipants: count || 0,
        };
      })
    );

    return NextResponse.json({ success: true, data: sessionsWithCounts });
  } catch (error) {
    console.error('Error fetching community sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new community session (creators only)
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyWhopUser();
    const { companyId, mode, duration, title } = await request.json();

    if (!companyId || !mode || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user has access to this company
    const headersList = await headers();
    const { userId: verifiedUserId } = await whopsdk.verifyUserToken(headersList);
    const access = await whopsdk.users.checkAccess(companyId, { id: verifiedUserId });

    if (!access.has_access) {
      return NextResponse.json(
        { error: 'No access to this company' },
        { status: 403 }
      );
    }

    // Create community session
    const { data: session, error } = await supabase
      .from('community_sessions')
      .insert({
        company_id: companyId,
        creator_id: userId,
        mode,
        duration,
        title: title || `${mode.replace('-', ' ')} Session`,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Automatically join the creator to the session
    await supabase
      .from('community_session_participants')
      .insert({
        session_id: session.id,
        user_id: userId,
        joined_at: new Date().toISOString(),
      });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error('Error creating community session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Join/leave a community session
export async function PATCH(request: NextRequest) {
  try {
    const userId = await verifyWhopUser();
    const { sessionId, action } = await request.json();

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'join') {
      // Check if already joined
      const { data: existing } = await supabase
        .from('community_session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .is('left_at', null)
        .single();

      if (existing) {
        return NextResponse.json(
          { success: true, message: 'Already joined' }
        );
      }

      // Join session
      const { error } = await supabase
        .from('community_session_participants')
        .insert({
          session_id: sessionId,
          user_id: userId,
          joined_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to join session' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Joined session' });
    } else if (action === 'leave') {
      // Leave session
      const { error } = await supabase
        .from('community_session_participants')
        .update({ left_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .is('left_at', null);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to leave session' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Left session' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating session participation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}