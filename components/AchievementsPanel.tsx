'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, X } from 'lucide-react';
import { achievements, Achievement } from '@/lib/achievements';

interface AchievementsPanelProps {
  unlockedAchievements: string[];
}

export function AchievementsPanel({ unlockedAchievements }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <>
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <p className="text-sm text-gray-300">
                {unlockedCount} of {totalCount} unlocked
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-300">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedAchievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);

            return (
              <motion.button
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAchievement(achievement)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all
                  ${isUnlocked
                    ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:border-yellow-500'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}
              >
                {/* Glow effect for unlocked */}
                {isUnlocked && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl"
                  />
                )}

                <div className="relative">
                  <div className={`
                    text-4xl mb-2
                    ${!isUnlocked && 'grayscale opacity-40'}
                  `}>
                    {achievement.icon}
                  </div>

                  <h3 className={`
                    font-semibold text-sm mb-1
                    ${isUnlocked ? 'text-white' : 'text-gray-300'}
                  `}>
                    {achievement.title}
                  </h3>

                  {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50"
            >
              <div className={`
                p-1 rounded-2xl
                ${unlockedAchievements.includes(selectedAchievement.id)
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gray-700'
                }
              `}>
                <div className="backdrop-blur-2xl bg-gray-900/95 rounded-2xl p-6 relative">
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </button>

                  <div className="text-center">
                    <div className={`
                      text-6xl mb-4
                      ${!unlockedAchievements.includes(selectedAchievement.id) && 'grayscale opacity-40'}
                    `}>
                      {selectedAchievement.icon}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedAchievement.title}
                    </h2>

                    <p className="text-gray-300 mb-4">
                      {selectedAchievement.description}
                    </p>

                    {unlockedAchievements.includes(selectedAchievement.id) ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-semibold">
                        <Trophy className="w-4 h-4" />
                        Unlocked!
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-gray-300">
                        <Lock className="w-4 h-4" />
                        Locked
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-300">
                        Requirement: {selectedAchievement.requirement}{' '}
                        {selectedAchievement.type === 'sessions' && 'sessions'}
                        {selectedAchievement.type === 'hours' && 'hours'}
                        {selectedAchievement.type === 'streak' && 'day streak'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
