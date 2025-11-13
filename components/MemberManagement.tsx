'use client';

import { useEffect, useState } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { motion } from 'framer-motion';
import { Users, Search, TrendingUp, Clock, Trophy, Filter } from 'lucide-react';

interface MemberManagementProps {
  companyId: string;
}

interface Member {
  userId: string;
  username: string;
  totalSessions: number;
  totalFocusTime: number;
  streakDays: number;
  lastActive: string;
  joinedAt: string;
}

export function MemberManagement({ companyId }: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'activity' | 'sessions' | 'time'>('activity');

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
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/admin/members?companyId=${companyId}`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [companyId]);

  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case 'sessions':
        return b.totalSessions - a.totalSessions;
      case 'time':
        return b.totalFocusTime - a.totalFocusTime;
      case 'activity':
      default:
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
  });

  const filteredMembers = sortedMembers.filter(
    (member) =>
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Member Management</h2>
          <p className="text-sm text-[var(--neutral-400)]">
            {members.length} total members
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[var(--neutral-500)] focus:border-white/20 focus:outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setSortBy('activity')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  sortBy === 'activity'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('sessions')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  sortBy === 'sessions'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              Sessions
            </button>
            <button
              onClick={() => setSortBy('time')}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  sortBy === 'time'
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white'
                }
              `}
            >
              Time
            </button>
          </div>
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
      ) : filteredMembers.length === 0 ? (
        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No members found</h3>
          <p className="text-[var(--neutral-400)]">
            {searchQuery ? 'Try a different search term' : 'No members yet'}
          </p>
        </div>
      ) : (
        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider">
            <div className="col-span-4">Member</div>
            <div className="col-span-2 text-center">Sessions</div>
            <div className="col-span-2 text-center">Focus Time</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-right">Last Active</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/10">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => handleWhopNav(`/dashboard/${companyId}/members/${member.userId}`)}
              >
                {/* Member Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-12">{member.username}</div>
                    <div className="text-xs text-[var(--neutral-500)]">
                      Member since {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Sessions */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {member.totalSessions}
                    </div>
                    <div className="text-xs text-[var(--neutral-500)]">sessions</div>
                  </div>
                </div>

                {/* Focus Time */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {(member.totalFocusTime / 3600).toFixed(1)}h
                    </div>
                    <div className="text-xs text-[var(--neutral-500)]">focused</div>
                  </div>
                </div>

                {/* Streak */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-lg font-bold text-white">{member.streakDays}</span>
                      {member.streakDays > 0 && <span className="text-orange-400">🔥</span>}
                    </div>
                    <div className="text-xs text-[var(--neutral-500)]">day streak</div>
                  </div>
                </div>

                {/* Last Active */}
                <div className="col-span-2 flex items-center justify-end">
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {formatLastActive(member.lastActive)}
                    </div>
                    <div className="text-xs text-[var(--neutral-500)]">last seen</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}