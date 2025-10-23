'use client';

import { useEffect, useState } from 'react';
import { FocusTimer } from './FocusTimer';
import { ModeSelector } from './ModeSelector';
import { MusicPlayer } from './MusicPlayer';
import { StatsPanel } from './StatsPanel';
import { StreakDisplay } from './StreakDisplay';
import { AchievementsPanel } from './AchievementsPanel';
import { AchievementNotification } from './AchievementNotification';
import { Achievement } from '@/lib/achievements';

interface FocusAppProps {
  userId: string;
}

export function FocusApp({ userId }: FocusAppProps) {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch(`/api/stats?userId=${userId}`);
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStreak(statsData.data.streakDays || 0);
          setBestStreak(statsData.data.bestStreak || 0);
        }

        // Fetch achievements
        const achievementsRes = await fetch(`/api/achievements?userId=${userId}`);
        const achievementsData = await achievementsRes.json();
        if (achievementsData.success) {
          setUnlockedAchievements(achievementsData.data.unlocked || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <>
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      <div className="flex flex-col items-center gap-12">
        {/* Mode Selection */}
        <ModeSelector />

        {/* Timer */}
        <FocusTimer userId={userId} />

        {/* Music Player */}
        <MusicPlayer />

        {/* Streak Display */}
        <StreakDisplay streak={streak} bestStreak={bestStreak} />

        {/* Stats */}
        <StatsPanel userId={userId} />

        {/* Achievements */}
        <AchievementsPanel unlockedAchievements={unlockedAchievements} />
      </div>
    </>
  );
}
