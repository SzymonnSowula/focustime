'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsPanelProps {
  userId: string;
}

interface UserStats {
  totalSessions: number;
  totalFocusTime: number;
  streakDays: number;
  bestStreak: number;
  sessionsThisWeek: number;
  focusTimeThisWeek: number;
}

export function StatsPanel({ userId }: StatsPanelProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
              <div className="h-8 bg-white/10 rounded mb-2 w-16" />
              <div className="h-4 bg-white/10 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalHours = stats ? (stats.totalFocusTime / 3600).toFixed(1) : '0';
  const weeklyGoal = stats ? Math.min(100, Math.round((stats.focusTimeThisWeek / (20 * 3600)) * 100)) : 0;

  const statCards = [
    {
      icon: Target,
      label: 'Total Sessions',
      value: stats?.totalSessions || 0,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      label: 'Focus Hours',
      value: `${totalHours}h`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: stats?.streakDays || 0,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Goal',
      value: `${weeklyGoal}%`,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors flex flex-col items-center text-center"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              
              <div className="text-sm text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
