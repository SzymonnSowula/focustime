'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  bestStreak?: number;
}

export function StreakDisplay({ streak, bestStreak = 0 }: StreakDisplayProps) {
  const getStreakColor = (days: number) => {
    if (days >= 30) return 'from-purple-500 to-pink-500';
    if (days >= 14) return 'from-orange-500 to-red-500';
    if (days >= 7) return 'from-yellow-500 to-orange-500';
    if (days >= 3) return 'from-green-500 to-emerald-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getStreakMessage = (days: number) => {
    if (days === 0) return "Start your streak today!";
    if (days === 1) return "Great start! Keep it going!";
    if (days < 7) return "Building momentum! 🚀";
    if (days < 14) return "You're on fire! 🔥";
    if (days < 30) return "Unstoppable! 💪";
    return "Legendary streak! 👑";
  };

  const flameSize = Math.min(streak * 2, 100);

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6 overflow-hidden relative">
        {/* Background glow effect */}
        {streak > 0 && (
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className={`absolute inset-0 bg-gradient-to-r ${getStreakColor(streak)} blur-3xl`}
          />
        )}

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={streak > 0 ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`p-3 rounded-xl bg-gradient-to-r ${getStreakColor(streak)}`}
              >
                <Flame className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                <p className="text-sm text-gray-300">{getStreakMessage(streak)}</p>
              </div>
            </div>

            {bestStreak > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-300 text-xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Best</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {bestStreak} days
                </div>
              </div>
            )}
          </div>

          {/* Streak counter */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={streak > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative"
            >
              <div className="text-8xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {streak}
              </div>
              <div className="text-center text-sm text-gray-400 mt-2">
                {streak === 1 ? 'day' : 'days'}
              </div>
            </motion.div>
          </div>

          {/* Streak milestones */}
          <div className="grid grid-cols-4 gap-2">
            {[3, 7, 14, 30].map((milestone) => (
              <div
                key={milestone}
                className={`
                  p-3 rounded-xl text-center transition-all
                  ${streak >= milestone
                    ? `bg-gradient-to-r ${getStreakColor(milestone)} text-white`
                    : 'bg-white/5 text-gray-400 border border-white/10'
                  }
                `}
              >
                <div className="text-2xl font-bold">{milestone}</div>
                <div className="text-xs mt-1">
                  {milestone === 3 && '🌱'}
                  {milestone === 7 && '⭐'}
                  {milestone === 14 && '🔥'}
                  {milestone === 30 && '👑'}
                </div>
              </div>
            ))}
          </div>

          {/* Progress to next milestone */}
          {streak > 0 && streak < 30 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                <span>Next milestone</span>
                <span>
                  {streak >= 14 ? '30 days' : streak >= 7 ? '14 days' : streak >= 3 ? '7 days' : '3 days'}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      streak >= 14
                        ? ((streak - 14) / (30 - 14)) * 100
                        : streak >= 7
                        ? ((streak - 7) / (14 - 7)) * 100
                        : streak >= 3
                        ? ((streak - 3) / (7 - 3)) * 100
                        : (streak / 3) * 100
                    }%`,
                  }}
                  className={`h-full bg-gradient-to-r ${getStreakColor(streak)}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
