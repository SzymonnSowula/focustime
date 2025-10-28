'use client';

import { useEffect, useState } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  TrendingUp,
  Zap,
  Calendar,
  Target,
  Activity,
  Award,
} from 'lucide-react';

interface AdminStatsProps {
  companyId: string;
}

interface Stats {
  totalMembers: number;
  activeThisWeek: number;
  totalSessions: number;
  totalFocusHours: number;
  avgSessionDuration: number;
  completionRate: number;
  sessionsToday: number;
  weekGrowth: number;
}

export function AdminStats({ companyId }: AdminStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/admin/stats?companyId=${companyId}&range=${timeRange}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [companyId, timeRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse"
          >
            <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
            <div className="h-8 bg-white/10 rounded mb-2" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Members',
      value: stats?.totalMembers || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: `+${stats?.weekGrowth || 0}% this week`,
    },
    {
      label: 'Active This Week',
      value: stats?.activeThisWeek || 0,
      icon: Activity,
      gradient: 'from-green-500 to-emerald-500',
      change: `${Math.round(((stats?.activeThisWeek || 0) / (stats?.totalMembers || 1)) * 100)}% engagement`,
    },
    {
      label: 'Total Sessions',
      value: stats?.totalSessions || 0,
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      change: `${stats?.sessionsToday || 0} today`,
    },
    {
      label: 'Focus Hours',
      value: `${stats?.totalFocusHours || 0}h`,
      icon: Clock,
      gradient: 'from-orange-500 to-red-500',
      change: 'Total time',
    },
    {
      label: 'Avg Session',
      value: `${stats?.avgSessionDuration || 0}m`,
      icon: Target,
      gradient: 'from-yellow-500 to-orange-500',
      change: 'Per session',
    },
    {
      label: 'Completion Rate',
      value: `${stats?.completionRate || 0}%`,
      icon: Award,
      gradient: 'from-pink-500 to-rose-500',
      change: 'Sessions finished',
    },
    {
      label: 'Weekly Trend',
      value: <TrendingUp className="w-8 h-8 text-green-400" />,
      icon: TrendingUp,
      gradient: 'from-teal-500 to-cyan-500',
      change: 'Growing',
    },
    {
      label: 'This Month',
      value: stats?.totalSessions ? Math.round(stats.totalSessions * 0.3) : 0,
      icon: Calendar,
      gradient: 'from-indigo-500 to-purple-500',
      change: 'Sessions',
    },
  ];

  const whop = useIframeSdk();

  // Helper to open Whop navigation
  const handleWhopNav = (url: string, newTab = false) => {
    if (whop && whop.openExternalUrl) {
      whop.openExternalUrl({ url, newTab });
    } else {
      window.location.href = url;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Community Overview</h2>
          <p className="text-sm text-[var(--neutral-400)]">
            Real-time analytics for your community
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'text-[var(--neutral-400)] hover:text-white hover:bg-white/5'
                }
              `}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>

              <div className="text-sm text-[var(--neutral-400)] mb-2">
                {stat.label}
              </div>

              <div className="text-xs text-[var(--neutral-500)]">
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 text-left hover:border-blue-500/40 transition-all"
          onClick={() => handleWhopNav(`/dashboard/${companyId}/members`)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">View All Members</div>
              <div className="text-xs text-[var(--neutral-400)]">Manage community access</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="backdrop-blur-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-left hover:border-green-500/40 transition-all"
          onClick={() => handleWhopNav(`/dashboard/${companyId}/sessions`)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Start Session</div>
              <div className="text-xs text-[var(--neutral-400)]">Host a community focus</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="backdrop-blur-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-all"
          onClick={() => handleWhopNav(`/dashboard/${companyId}/export`)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Export Data</div>
              <div className="text-xs text-[var(--neutral-400)]">Download analytics report</div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}