'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Calendar, Filter, Download } from 'lucide-react';

interface SessionHistoryProps {
  companyId: string;
}

interface Session {
  id: string;
  creator_id: string;
  mode: string;
  duration: number;
  title: string;
  started_at: string;
  ended_at: string;
  participant_count: number;
}

export function SessionHistory({ companyId }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pomodoro' | 'deep-work'>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/admin/sessions?companyId=${companyId}`);
        const data = await res.json();
        if (data.success) {
          setSessions(data.data);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [companyId]);

  const filteredSessions = sessions.filter((session) =>
    filter === 'all' ? true : session.mode === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'pomodoro':
        return 'from-red-500 to-orange-500';
      case 'deep-work':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Session History</h2>
          <p className="text-sm text-[var(--neutral-400)]">
            All community focus sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  filter === 'all'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pomodoro')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  filter === 'pomodoro'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              Pomodoro
            </button>
            <button
              onClick={() => setFilter('deep-work')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  filter === 'deep-work'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              Deep Work
            </button>
          </div>

          {/* Export */}
          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-[var(--neutral-300)] hover:text-white transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="backdrop-blur-2xl bg-white/5 rounded-xl border border-white/10 p-4 animate-pulse"
            >
              <div className="h-16" />
            </div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
          <p className="text-[var(--neutral-400)]">
            Start your first community session to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-2xl bg-white/5 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Mode Badge */}
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getModeColor(session.mode)} group-hover:scale-110 transition-transform`}>
                    <Clock className="w-5 h-5 text-white" />
                  </div>

                  {/* Session Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--neutral-400)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(session.started_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.floor(session.duration / 60)} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {session.participant_count} participants
                      </span>
                    </div>
                  </div>

                  {/* Mode Tag */}
                  <div className="hidden md:block">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${session.mode === 'pomodoro'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }
                    `}>
                      {session.mode.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {session.ended_at ? (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}