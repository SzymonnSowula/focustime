'use client';

import { useEffect, useState } from 'react';
import { PremiumTimer } from './PremiumTimer';
import { PremiumModeSelector } from './PremiumModeSelector';
import { MusicPlayer } from './MusicPlayer';
import { StatsPanel } from './StatsPanel';
import { StreakDisplay } from './StreakDisplay';
import { AchievementsPanel } from './AchievementsPanel';
import { AchievementNotification } from './AchievementNotification';
import { Achievement, achievements } from '@/lib/achievements';
import { useFocusStore } from '@/lib/store';

interface FocusAppProps {
  userId: string;
}

const MODE_DURATIONS = {
  pomodoro: 25 * 60,
  'deep-work': 90 * 60,
};

export function FocusApp({ userId }: FocusAppProps) {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const { mode, totalTime } = useFocusStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats (userId verified from Whop token)
        const statsRes = await fetch('/api/stats');
        if (statsRes.status === 401) {
          console.error('Unauthorized - Whop token invalid');
          return;
        }
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStreak(statsData.data.streakDays || 0);
          setBestStreak(statsData.data.bestStreak || 0);
        }

        // Fetch achievements (userId verified from Whop token)
        const achievementsRes = await fetch('/api/achievements');
        if (achievementsRes.status === 401) {
          console.error('Unauthorized - Whop token invalid');
          return;
        }
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

  const handleTimerComplete = async () => {
    // Save session to database
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          duration: mode === 'custom' ? totalTime : MODE_DURATIONS[mode],
        }),
      });

      // Check for new achievements after session completion
      const achievementsRes = await fetch('/api/achievements');
      const achievementsData = await achievementsRes.json();
      
      if (achievementsData.success) {
        const newUnlocked = achievementsData.data.unlocked || [];
        
        // Find newly unlocked achievements
        const newAchievements = newUnlocked.filter(
          (id: string) => !unlockedAchievements.includes(id)
        );
        
        // Update unlocked achievements list
        setUnlockedAchievements(newUnlocked);
        
        // Show notification for the first new achievement
        if (newAchievements.length > 0) {
          const achievement = achievements.find(a => a.id === newAchievements[0]);
          if (achievement) {
            setNewAchievement(achievement);
          }
        }
      }

      // Refresh stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStreak(statsData.data.streakDays || 0);
        setBestStreak(statsData.data.bestStreak || 0);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return (
    <>
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      <div className="flex flex-col items-center gap-16">
        {/* Mode Selection */}
        <PremiumModeSelector />

        {/* Timer */}
        <PremiumTimer
          initialTime={mode === 'custom' ? totalTime : MODE_DURATIONS[mode]}
          mode={mode}
          onComplete={handleTimerComplete}
        />

        {/* Music Player */}
        <MusicPlayer />

        {/* Streak Display */}
        <StreakDisplay streak={streak} bestStreak={bestStreak} />

        {/* Stats */}
        <StatsPanel />

        {/* Achievements */}
        <AchievementsPanel unlockedAchievements={unlockedAchievements} />
      </div>
    </>
  );
}
