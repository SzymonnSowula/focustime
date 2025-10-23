export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'sessions' | 'hours' | 'streak' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first focus session',
    icon: '🎯',
    requirement: 1,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'ten_sessions',
    title: 'Getting Started',
    description: 'Complete 10 focus sessions',
    icon: '⭐',
    requirement: 10,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'fifty_sessions',
    title: 'Focused Mind',
    description: 'Complete 50 focus sessions',
    icon: '🌟',
    requirement: 50,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'hundred_sessions',
    title: 'Focus Master',
    description: 'Complete 100 focus sessions',
    icon: '💫',
    requirement: 100,
    type: 'sessions',
    unlocked: false,
  },
  {
    id: 'ten_hours',
    title: 'Time Invested',
    description: 'Accumulate 10 hours of focus time',
    icon: '⏰',
    requirement: 10,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'fifty_hours',
    title: 'Dedicated',
    description: 'Accumulate 50 hours of focus time',
    icon: '🎓',
    requirement: 50,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'hundred_hours',
    title: 'Expert',
    description: 'Accumulate 100 hours of focus time',
    icon: '🏆',
    requirement: 100,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'three_day_streak',
    title: 'Building Habits',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '💪',
    requirement: 7,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'two_week_streak',
    title: 'Consistency King',
    description: 'Maintain a 14-day streak',
    icon: '👑',
    requirement: 14,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'month_streak',
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: '🚀',
    requirement: 30,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'deep_work_master',
    title: 'Deep Work Master',
    description: 'Complete 10 Deep Work sessions',
    icon: '⚡',
    requirement: 10,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'pomodoro_pro',
    title: 'Pomodoro Pro',
    description: 'Complete 25 Pomodoro sessions',
    icon: '🍅',
    requirement: 25,
    type: 'special',
    unlocked: false,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete sessions on both Saturday and Sunday',
    icon: '🎖️',
    requirement: 1,
    type: 'special',
    unlocked: false,
  },
];

export function checkAchievements(stats: {
  totalSessions: number;
  totalFocusTime: number;
  streakDays: number;
}): Achievement[] {
  const unlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    if (achievement.unlocked) return;

    let shouldUnlock = false;

    switch (achievement.type) {
      case 'sessions':
        shouldUnlock = stats.totalSessions >= achievement.requirement;
        break;
      case 'hours':
        const hours = stats.totalFocusTime / 3600;
        shouldUnlock = hours >= achievement.requirement;
        break;
      case 'streak':
        shouldUnlock = stats.streakDays >= achievement.requirement;
        break;
    }

    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      unlocked.push(achievement);
    }
  });

  return unlocked;
}

export const motivationalQuotes = [
  "Focus is the gateway to thinking clearly.",
  "The secret of change is to focus all your energy on building the new.",
  "Concentrate all your thoughts upon the work in hand.",
  "Where focus goes, energy flows.",
  "The successful warrior is the average person with laser-like focus.",
  "Stay focused, go after your dreams and keep moving toward your goals.",
  "Focus on being productive instead of busy.",
  "Your focus determines your reality.",
  "The key to success is to focus on goals, not obstacles.",
  "Lack of direction, not lack of time, is the problem.",
  "Deep work is the superpower of the 21st century.",
  "The ability to concentrate is a gift.",
  "Focus is a matter of deciding what not to do.",
  "Starve your distractions, feed your focus.",
  "You can't depend on your eyes when your imagination is out of focus.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
