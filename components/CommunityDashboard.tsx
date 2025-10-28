'use client';

import { useEffect, useState } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, Zap, Trophy, Play } from 'lucide-react';

interface CommunityDashboardProps {
  companyId: string;
}

interface CommunityStats {
  totalSessions: number;
  totalFocusTime: number;
  activeMembersToday: number;
  topMembers: Array<{
    userId: string;
    sessions: number;
    focusTime: number;
  }>;
}

interface ActiveSession {
  id: string;
  creator_id: string;
  mode: string;
  duration: number;
  title: string;
  started_at: string;
  activeParticipants: number;
}

export function CommunityDashboard({ companyId }: CommunityDashboardProps) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);

  const whop = useIframeSdk();

  // Helper to open Whop navigation
  const handleWhopNav = (url: string, newTab = false) => {
    if (whop && whop.openExternalUrl) {
      whop.openExternalUrl({ url, newTab });
    } else {
      window.location.href = url;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch community stats
        const statsRes = await fetch(`/api/community/stats?companyId=${companyId}`);
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch active sessions
        const sessionsRes = await fetch(`/api/community/sessions?companyId=${companyId}`);
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) {
          setActiveSessions(sessionsData.data);
        }
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [companyId]);

  const handleJoinSession = async (sessionId: string) => {
    // Use Whop navigation to join session page
    handleWhopNav(`/community/sessions/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-8">Community Dashboard</h2>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalHours = stats ? (stats.totalFocusTime / 3600).toFixed(1) : '0';

  return (
    <div className="w-full max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Community Dashboard</h2>
          <p className="text-[var(--neutral-400)]">See how your community is focusing together</p>
        </div>
      </div>

      {/* Community Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-[var(--neutral-400)]">Active Today</h3>
          </div>
          <div className="text-3xl font-bold text-white">{stats?.activeMembersToday || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-[var(--neutral-400)]">Total Sessions</h3>
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalSessions || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-[var(--neutral-400)]">Focus Hours</h3>
          </div>
          <div className="text-3xl font-bold text-white">{totalHours}h</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-[var(--neutral-400)]">Live Sessions</h3>
          </div>
          <div className="text-3xl font-bold text-white">{activeSessions.length}</div>
        </motion.div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Focus Sessions
          </h3>
          <div className="grid gap-4">
            {activeSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-[var(--neutral-400)]">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {session.activeParticipants} focusing
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(session.duration / 60)} minutes
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinSession(session.id)}
                    className="px-6 py-3 bg-gradient-to-r from-[#0A84FF] to-[#5E5CE6] rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <Play className="w-4 h-4" />
                    Join Session
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Top Members This Week */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Top Members This Week
        </h3>
        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          {stats?.topMembers && stats.topMembers.length > 0 ? (
            <div className="divide-y divide-white/10">
              {stats.topMembers.map((member, index) => (
                <motion.div
                  key={member.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                          index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white' :
                          'bg-white/10 text-[var(--neutral-400)]'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">User {member.userId.slice(0, 8)}</div>
                        <div className="text-sm text-[var(--neutral-400)]">
                          {member.sessions} sessions • {(member.focusTime / 3600).toFixed(1)}h
                        </div>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--neutral-400)]">
              No data yet. Complete sessions to appear on the leaderboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}